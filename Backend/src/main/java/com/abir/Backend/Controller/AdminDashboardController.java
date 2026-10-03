package com.abir.Backend.Controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abir.Backend.entity.ApplicationStatus;
import com.abir.Backend.entity.LicenseStatus;
import com.abir.Backend.entity.Role;
import com.abir.Backend.repository.ComplaintRepository;
import com.abir.Backend.repository.LicenseApplicationRepository;
import com.abir.Backend.repository.LicenseRepository;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.repository.VendingZoneRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final LicenseApplicationRepository applicationRepository;
    private final LicenseRepository licenseRepository;
    private final VendingZoneRepository zoneRepository;
    private final ComplaintRepository complaintRepository;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        long totalVendors = userRepository.countByRole(Role.VENDOR);
        long activeLicenses = licenseRepository.countByStatus(LicenseStatus.ACTIVE);
        long expiredLicenses = licenseRepository.countByStatus(LicenseStatus.EXPIRED);
        long pendingApplications = applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED || a.getStatus() == ApplicationStatus.UNDER_REVIEW)
                .count();
        long availableZones = zoneRepository.findByActiveTrue().size();
        long pendingComplaints = complaintRepository.findAll().stream()
                .filter(c -> c.getStatus() == com.abir.Backend.entity.ComplaintStatus.OPEN
                        || c.getStatus() == com.abir.Backend.entity.ComplaintStatus.IN_PROGRESS)
                .count();

        return Map.of(
                "totalVendors", totalVendors,
                "activeLicenses", activeLicenses,
                "expiredLicenses", expiredLicenses,
                "pendingApplications", pendingApplications,
                "availableZones", availableZones,
                "pendingComplaints", pendingComplaints
        );
    }
}
