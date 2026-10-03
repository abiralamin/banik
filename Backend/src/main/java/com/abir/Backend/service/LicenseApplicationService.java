package com.abir.Backend.service;

import com.abir.Backend.dto.application.*;
import com.abir.Backend.dto.license.LicenseIssueRequest;
import com.abir.Backend.entity.*;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LicenseApplicationService {

    private final LicenseApplicationRepository applicationRepository;
    private final VendingZoneRepository zoneRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final FileStorageService fileStorageService;
    private final EmailClientService emailClientService;
    private final LicenseService licenseService;

    @Transactional
    public ApplicationResponse submit(User vendor, ApplicationSubmitRequest req) {
        VendingZone primary = zoneRepository.findById(req.primaryZoneId())
                .orElseThrow(() -> ApiException.notFound("Selected primary zone not found"));
        VendingZone alternate = req.alternateZoneId() == null ? null :
                zoneRepository.findById(req.alternateZoneId())
                        .orElseThrow(() -> ApiException.notFound("Selected alternate zone not found"));

        LicenseApplication app = LicenseApplication.builder()
                .vendor(vendor)
                .fullName(req.fullName())
                .gender(req.gender() == null || req.gender().isBlank() ? null : Gender.valueOf(req.gender().toUpperCase()))
                .dateOfBirth(req.dateOfBirth())
                .address(req.address())
                .businessName(req.businessName())
                .businessType(req.businessType() != null ? req.businessType() : "General") // Use selected business type or default
                .stallDimensions(req.stallSize() != null ? req.stallSize() : "Standard") // Use selected stall size or default
                .operatingHours(req.operatingHour() != null ? req.operatingHour() : "09:00-18:00") // Use selected operating hour or default
                .facilities(req.facilities() != null ? req.facilities() : "None") // Use selected facilities or default
                .primaryZone(primary)
                .alternateZone(alternate)
                .licenseType(LicenseType.valueOf(req.licenseType().toUpperCase()))
                .status(ApplicationStatus.SUBMITTED)
                .build();
        app = applicationRepository.save(app);
        recordHistory(app, "SUBMITTED", "Application submitted by vendor", vendor);
        return toResponse(app);
    }

    @Transactional
    public void uploadDocument(User vendor, Long applicationId, DocumentType type, MultipartFile file) {
        LicenseApplication app = getOwnedOrThrow(vendor, applicationId);
        String path = fileStorageService.store(file, "applications/" + applicationId);
        documentRepository.save(ApplicationDocument.builder()
                .application(app)
                .docType(type)
                .filePath(path)
                .originalName(file.getOriginalFilename())
                .build());
    }

    @Transactional
    public void uploadDocumentAdmin(Long applicationId, DocumentType type, MultipartFile file) {
        LicenseApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ApiException.notFound("Application not found"));
        String path = fileStorageService.store(file, "applications/" + applicationId);
        documentRepository.save(ApplicationDocument.builder()
                .application(app)
                .docType(type)
                .filePath(path)
                .originalName(file.getOriginalFilename())
                .build());
    }

    public List<ApplicationResponse> listMine(User vendor) {
        return applicationRepository.findByVendorIdOrderBySubmittedAtDesc(vendor.getId())
                .stream().map(this::toResponse).toList();
    }

    public ApplicationResponse get(User vendor, Long id) {
        return toResponse(getOwnedOrThrow(vendor, id));
    }

    @Transactional
    public void withdraw(User vendor, Long id) {
        LicenseApplication app = getOwnedOrThrow(vendor, id);
        if (app.getStatus() == ApplicationStatus.APPROVED) {
            throw ApiException.badRequest("An approved application cannot be withdrawn");
        }
        app.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(app);
        recordHistory(app, "WITHDRAWN", "Withdrawn by vendor", vendor);
    }

    @Transactional
    public void payApplicationFee(User vendor, Long id) {
        LicenseApplication app = getOwnedOrThrow(vendor, id);
        app.setFeePaid(true);
        applicationRepository.save(app);
        recordHistory(app, "FEE_PAID", "Application fee paid (dummy payment)", vendor);
    }

    public Page<ApplicationResponse> adminList(ApplicationStatus status, String search, Pageable pageable) {
        Page<LicenseApplication> page = (search != null && !search.isBlank())
                ? applicationRepository.findByFullNameContainingIgnoreCase(search, pageable)
                : (status != null ? applicationRepository.findByStatus(status, pageable) : applicationRepository.findAll(pageable));
        return page.map(this::toResponse);
    }

    public ApplicationResponse adminGet(Long id) {
        LicenseApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Application not found"));
        // Force loading of lazy-loaded relationships
        if (app.getPrimaryZone() != null) {
            app.getPrimaryZone().getName();
        }
        if (app.getAlternateZone() != null) {
            app.getAlternateZone().getName();
        }
        return toResponse(app);
    }

    @Transactional
    public ApplicationResponse decide(User admin, Long id, ApplicationDecisionRequest req) {
        LicenseApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Application not found"));
        ApplicationStatus previousStatus = app.getStatus();

        switch (req.action().toUpperCase()) {
            case "APPROVE" -> {
                app.setStatus(ApplicationStatus.APPROVED);
                if (req.location() != null) {
                    System.out.println("Setting location on application: lat=" + req.location().lat() + ", lng=" + req.location().lng());
                    app.setLocationLat(req.location().lat());
                    app.setLocationLng(req.location().lng());
                }
                recordHistory(app, "APPROVED", req.notes(), admin);
                emailClientService.sendNotificationEmail(app.getVendor().getEmail(), "License Application Approved",
                        "Your license application #" + app.getId() + " has been approved.");
            }
            case "REJECT" -> {
                app.setStatus(ApplicationStatus.REJECTED);
                app.setRejectionReason(req.reason());
                recordHistory(app, "REJECTED", req.reason(), admin);
                emailClientService.sendNotificationEmail(app.getVendor().getEmail(), "License Application Rejected",
                        "Your license application #" + app.getId() + " was rejected: " + req.reason());
            }
            case "REQUEST_MORE_INFO" -> {
                app.setStatus(ApplicationStatus.MORE_INFO_REQUESTED);
                recordHistory(app, "MORE_INFO_REQUESTED", req.notes(), admin);
            }
            case "UNDER_REVIEW" -> {
                app.setStatus(ApplicationStatus.UNDER_REVIEW);
                recordHistory(app, "UNDER_REVIEW", req.notes(), admin);
            }
            default -> throw ApiException.badRequest("Unknown action: " + req.action());
        }
        if (req.notes() != null) {
            app.setAdminNotes(req.notes());
        }
        app = applicationRepository.save(app);

        // Approving an application immediately issues (or is a no-op if already issued) the
        // digital license and bumps zone occupancy exactly once - see LicenseService#issue.
        if (app.getStatus() == ApplicationStatus.APPROVED && previousStatus != ApplicationStatus.APPROVED) {
            licenseService.issue(new LicenseIssueRequest(app.getId(), null, null));
        }

        return toResponse(app);
    }

    @Transactional
    public void bulkDecide(User admin, BulkActionRequest req) {
        for (Long id : req.applicationIds()) {
            decide(admin, id, new ApplicationDecisionRequest(req.action(), req.reason(), null, null));
        }
    }

    private LicenseApplication getOwnedOrThrow(User vendor, Long id) {
        LicenseApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Application not found"));
        if (!app.getVendor().getId().equals(vendor.getId())) {
            throw ApiException.forbidden("You do not have access to this application");
        }
        return app;
    }

    private void recordHistory(LicenseApplication app, String status, String remarks, User actor) {
        historyRepository.save(ApplicationStatusHistory.builder()
                .application(app).status(status).remarks(remarks).changedBy(actor).build());
    }

    private ApplicationResponse toResponse(LicenseApplication a) {
        com.abir.Backend.dto.LocationCoordinates location = null;
        if (a.getLocationLat() != null && a.getLocationLng() != null) {
            location = new com.abir.Backend.dto.LocationCoordinates(
                a.getLocationLat(),
                a.getLocationLng()
            );
        }
        com.abir.Backend.dto.LocationCoordinates zoneCenter = null;
        if (a.getPrimaryZone() != null && a.getPrimaryZone().getLatitude() != null && a.getPrimaryZone().getLongitude() != null) {
            zoneCenter = new com.abir.Backend.dto.LocationCoordinates(
                a.getPrimaryZone().getLatitude(),
                a.getPrimaryZone().getLongitude()
            );
        }
        return new ApplicationResponse(a.getId(), a.getFullName(), a.getBusinessName(),
                a.getPrimaryZone() == null ? null : a.getPrimaryZone().getName(),
                a.getAlternateZone() == null ? null : a.getAlternateZone().getName(),
                a.getLicenseType().name(), a.getStatus().name(), a.getPriority().name(),
                a.getRejectionReason(), a.getAdminNotes(), a.isDocumentsVerified(), a.isBackgroundCheckDone(),
                a.isZoneAvailabilityChecked(), a.isFeePaid(), a.getSubmittedAt(),
                a.getGender() != null ? a.getGender().name() : null,
                a.getDateOfBirth(),
                a.getAddress(),
                a.getBusinessType() != null ? a.getBusinessType() : "General",
                a.getStallDimensions() != null ? a.getStallDimensions() : "Standard",
                a.getOperatingHours() != null ? a.getOperatingHours() : "09:00-18:00",
                a.getFacilities() != null ? a.getFacilities() : "None",
                location,
                zoneCenter);
    }
}
