package com.abir.Backend.service;

import com.abir.Backend.dto.license.LicenseIssueRequest;
import com.abir.Backend.dto.license.LicenseResponse;
import com.abir.Backend.dto.license.LicenseVerifyResponse;
import com.abir.Backend.dto.license.RenewalRequest;
import com.abir.Backend.dto.license.RenewalResponse;
import com.abir.Backend.entity.*;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.LicenseApplicationRepository;
import com.abir.Backend.repository.LicenseRenewalRepository;
import com.abir.Backend.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LicenseService {

    private final LicenseRepository licenseRepository;
    private final LicenseApplicationRepository applicationRepository;
    private final LicenseRenewalRepository renewalRepository;
    private final ZoneService zoneService;
    private final QrCodeService qrCodeService;
    private final EmailClientService emailClientService;

    @Transactional
    public LicenseResponse issue(LicenseIssueRequest req) {
        LicenseApplication app = applicationRepository.findById(req.applicationId())
                .orElseThrow(() -> ApiException.notFound("Application not found"));
        if (app.getStatus() != ApplicationStatus.APPROVED) {
            throw ApiException.badRequest("Only approved applications can be issued a license");
        }

        return licenseRepository.findByApplicationId(app.getId())
                // Already issued for this application: update details instead of duplicating
                // the license or incrementing zone occupancy again (duplicate-approval guard).
                .map(existing -> {
                    if (req.category() != null) existing.setCategory(req.category());
                    if (req.authorizedGoods() != null) {
                        existing.setAuthorizedGoods(req.authorizedGoods());
                    } else if (existing.getAuthorizedGoods() == null) {
                        existing.setAuthorizedGoods(app.getBusinessType());
                    }
                    if (app.getLocationLat() != null) {
                        System.out.println("Updating existing license location: lat=" + app.getLocationLat() + ", lng=" + app.getLocationLng());
                        existing.setLocationLat(app.getLocationLat());
                        existing.setLocationLng(app.getLocationLng());
                    }
                    return toResponse(licenseRepository.save(existing));
                })
                .orElseGet(() -> issueNew(app, req));
    }

    private LicenseResponse issueNew(LicenseApplication app, LicenseIssueRequest req) {
        String licenseNumber = generateLicenseNumber();
        LocalDate issueDate = LocalDate.now();
        LocalDate validityEnd = computeValidityEnd(issueDate, app.getLicenseType());

        System.out.println("Creating new license with location from app: lat=" + app.getLocationLat() + ", lng=" + app.getLocationLng());

        License license = License.builder()
                .application(app)
                .vendor(app.getVendor())
                .licenseNumber(licenseNumber)
                .zone(app.getPrimaryZone())
                .licenseType(app.getLicenseType())
                .category(req.category())
                .authorizedGoods(req.authorizedGoods() != null ? req.authorizedGoods() : app.getBusinessType())
                .issueDate(issueDate)
                .validityStart(issueDate)
                .validityEnd(validityEnd)
                .status(LicenseStatus.ACTIVE)
                .locationLat(app.getLocationLat())
                .locationLng(app.getLocationLng())
                .build();
        // QR only carries the license number; full details are looked up via the
        // public verification endpoint so no vendor personal data is embedded in the code.
        String qrContent = "BANIK-LICENSE:" + licenseNumber;
        license.setQrCodeData(qrCodeService.generateBase64Png(qrContent));
        license = licenseRepository.save(license);

        zoneService.incrementOccupancy(app.getPrimaryZone().getId());

        emailClientService.sendNotificationEmail(app.getVendor().getEmail(), "Digital License Issued",
                "Your license " + licenseNumber + " has been issued and is now active.");

        return toResponse(license);
    }

    @Transactional(readOnly = true)
    public List<LicenseResponse> listMine(User vendor) {
        return licenseRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<LicenseResponse> listForVendorId(Long vendorId) {
        return licenseRepository.findByVendorIdOrderByCreatedAtDesc(vendorId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public LicenseResponse get(User vendor, Long id) {
        return toResponse(getOwnedOrThrow(vendor, id));
    }

    @Transactional(readOnly = true)
    public LicenseResponse adminGet(Long id) {
        return toResponse(licenseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("License not found")));
    }

    @Transactional(readOnly = true)
    public LicenseVerifyResponse verifyByLicenseNumber(String licenseNumber) {
        License license = licenseRepository.findByLicenseNumber(licenseNumber)
                .orElseThrow(() -> ApiException.notFound("No license found with this number"));
        return new LicenseVerifyResponse(license.getLicenseNumber(), license.getStatus().name(),
                license.getLicenseType().name(), license.getZone().getName(),
                license.getValidityStart(), license.getValidityEnd());
    }

    @Transactional
    public void revoke(Long id, String reason) {
        License license = licenseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("License not found"));
        if (license.getStatus() != LicenseStatus.ACTIVE) {
            throw ApiException.conflict("Only an active license can be revoked");
        }
        license.setStatus(LicenseStatus.REVOKED);
        licenseRepository.save(license);
        // Free up the zone spot occupied by this license (guarded above: only ACTIVE -> REVOKED once).
        zoneService.decrementOccupancy(license.getZone().getId());
        emailClientService.sendNotificationEmail(license.getVendor().getEmail(), "License Revoked",
                "Your license " + license.getLicenseNumber() + " has been revoked: " + reason);
    }

    @Transactional
    public void reportLost(User vendor, Long id) {
        License license = getOwnedOrThrow(vendor, id);
        license.setLostReported(true);
        licenseRepository.save(license);
    }

    @Transactional
    public void toggleAutoRenew(User vendor, Long id, boolean enabled) {
        License license = getOwnedOrThrow(vendor, id);
        license.setAutoRenew(enabled);
        licenseRepository.save(license);
    }

    @Transactional
    public RenewalResponse requestRenewal(User vendor, Long licenseId, RenewalRequest req) {
        License license = getOwnedOrThrow(vendor, licenseId);
        RenewalPeriod period = RenewalPeriod.valueOf(req.period().toUpperCase());

        BigDecimal baseFee = feeForPeriod(license, period);
        boolean earlyBird = license.getValidityEnd().isAfter(LocalDate.now().plusDays(15));
        BigDecimal discount = earlyBird ? baseFee.multiply(BigDecimal.valueOf(0.10)) : BigDecimal.ZERO;

        LocalDate base = license.getValidityEnd().isAfter(LocalDate.now()) ? license.getValidityEnd() : LocalDate.now();
        LocalDate newValidityEnd = extend(base, period);

        LicenseRenewal renewal = LicenseRenewal.builder()
                .license(license)
                .period(period)
                .fee(baseFee)
                .discount(discount)
                .status(RenewalStatus.PENDING)
                .newValidityEnd(newValidityEnd)
                .build();
        renewal = renewalRepository.save(renewal);
        return new RenewalResponse(renewal.getId(), renewal.getPeriod().name(), renewal.getFee(),
                renewal.getDiscount(), renewal.getStatus().name(), renewal.getNewValidityEnd());
    }

    @Transactional
    public RenewalResponse confirmRenewalPayment(User vendor, Long licenseId, Long renewalId) {
        License license = getOwnedOrThrow(vendor, licenseId);
        LicenseRenewal renewal = renewalRepository.findById(renewalId)
                .orElseThrow(() -> ApiException.notFound("Renewal request not found"));
        renewal.setStatus(RenewalStatus.PAID);
        renewal.setApprovedAt(java.time.LocalDateTime.now());
        renewalRepository.save(renewal);

        license.setValidityEnd(renewal.getNewValidityEnd());
        license.setStatus(LicenseStatus.ACTIVE);
        licenseRepository.save(license);

        return new RenewalResponse(renewal.getId(), renewal.getPeriod().name(), renewal.getFee(),
                renewal.getDiscount(), renewal.getStatus().name(), renewal.getNewValidityEnd());
    }

    private BigDecimal feeForPeriod(License license, RenewalPeriod period) {
        VendingZone zone = license.getZone();
        return switch (period) {
            case ONE_MONTH -> zone.getPriceMonthly();
            case THREE_MONTHS -> zone.getPriceMonthly().multiply(BigDecimal.valueOf(3));
            case SIX_MONTHS -> zone.getPriceMonthly().multiply(BigDecimal.valueOf(6));
            case ONE_YEAR -> zone.getPriceAnnual();
        };
    }

    private LocalDate extend(LocalDate from, RenewalPeriod period) {
        return switch (period) {
            case ONE_MONTH -> from.plusMonths(1);
            case THREE_MONTHS -> from.plusMonths(3);
            case SIX_MONTHS -> from.plusMonths(6);
            case ONE_YEAR -> from.plusYears(1);
        };
    }

    private LocalDate computeValidityEnd(LocalDate issueDate, LicenseType type) {
        return switch (type) {
            case DAILY -> issueDate.plusDays(1);
            case WEEKLY -> issueDate.plusWeeks(1);
            case MONTHLY -> issueDate.plusMonths(1);
            case ANNUAL -> issueDate.plusYears(1);
        };
    }

    private String generateLicenseNumber() {
        return "BNK-" + LocalDate.now().getYear() + "-" + String.format("%06d", licenseRepository.count() + 1);
    }

    private License getOwnedOrThrow(User vendor, Long id) {
        License license = licenseRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("License not found"));
        if (!license.getVendor().getId().equals(vendor.getId())) {
            throw ApiException.forbidden("You do not have access to this license");
        }
        return license;
    }

    private LicenseResponse toResponse(License l) {
        long daysUntilExpiry = ChronoUnit.DAYS.between(LocalDate.now(), l.getValidityEnd());
        String vendorName = l.getVendor().getVendorProfile() != null
            ? l.getVendor().getVendorProfile().getFullName()
            : l.getVendor().getEmail();
        com.abir.Backend.dto.LocationCoordinates location = null;
        if (l.getLocationLat() != null && l.getLocationLng() != null) {
            location = new com.abir.Backend.dto.LocationCoordinates(
                l.getLocationLat(),
                l.getLocationLng()
            );
            System.out.println("License location in toResponse: lat=" + l.getLocationLat() + ", lng=" + l.getLocationLng());
        }
        // Get additional fields from the associated LicenseApplication
        String businessName = l.getApplication() != null ? l.getApplication().getBusinessName() : null;
        String stallDimensions = l.getApplication() != null ? l.getApplication().getStallDimensions() : null;
        String operatingHours = l.getApplication() != null ? l.getApplication().getOperatingHours() : null;
        String facilities = l.getApplication() != null ? l.getApplication().getFacilities() : null;

        return new LicenseResponse(l.getId(), l.getLicenseNumber(),
                vendorName, l.getZone().getName(), l.getLicenseType().name(), l.getCategory(),
                l.getAuthorizedGoods(), l.getIssueDate(), l.getValidityStart(), l.getValidityEnd(),
                l.getStatus().name(), l.getQrCodeData(), l.isAutoRenew(), l.isLostReported(), daysUntilExpiry, location,
                businessName, stallDimensions, operatingHours, facilities);
    }
}
