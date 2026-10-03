package com.abir.Backend.service;

import com.abir.Backend.dto.vendor.VendorDetailResponse;
import com.abir.Backend.dto.vendor.VendorProfileResponse;
import com.abir.Backend.dto.vendor.VendorSummaryResponse;
import com.abir.Backend.entity.LicenseStatus;
import com.abir.Backend.entity.Role;
import com.abir.Backend.entity.User;
import com.abir.Backend.entity.VendorProfile;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.LicenseApplicationRepository;
import com.abir.Backend.repository.LicenseRepository;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminVendorService {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final LicenseRepository licenseRepository;
    private final LicenseApplicationRepository applicationRepository;
    private final ComplaintService complaintService;
    private final LicenseService licenseService;

    public List<VendorSummaryResponse> listVendors() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.VENDOR).stream().map(vendor -> {
            VendorProfile profile = vendorProfileRepository.findByUserId(vendor.getId()).orElse(null);
            var licenses = licenseRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
            long active = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.ACTIVE).count();
            int applications = applicationRepository.findByVendorIdOrderBySubmittedAtDesc(vendor.getId()).size();
            int complaints = complaintService.listForVendorAdmin(vendor.getId()).size();
            return new VendorSummaryResponse(vendor.getId(), vendor.getEmail(),
                    profile == null ? null : profile.getFullName(),
                    profile == null ? null : profile.getBusinessName(),
                    profile == null ? null : profile.getPhone(),
                    vendor.isActive(), licenses.size(), (int) active, applications, complaints);
        }).toList();
    }

    public VendorDetailResponse getVendorDetail(Long vendorId) {
        User vendor = userRepository.findById(vendorId)
                .filter(u -> u.getRole() == Role.VENDOR)
                .orElseThrow(() -> ApiException.notFound("Vendor not found"));
        VendorProfile profile = vendorProfileRepository.findByUserId(vendorId).orElse(null);

        VendorProfileResponse profileResponse = new VendorProfileResponse(vendor.getEmail(),
                profile == null ? null : profile.getFullName(),
                profile == null || profile.getGender() == null ? null : profile.getGender().name(),
                profile == null ? null : profile.getDateOfBirth(),
                profile == null ? null : profile.getAddress(),
                profile == null ? null : profile.getPhone(),
                profile == null ? null : profile.getNationalIdNumber(),
                profile == null ? 0 : profile.getProfileCompletion(),
                profile != null && profile.isDeactivationRequested(),
                profile != null && profile.getGender() != null);

        return new VendorDetailResponse(profileResponse,
                licenseService.listForVendorId(vendorId),
                complaintService.listForVendorAdmin(vendorId));
    }
}
