package com.abir.Backend.Controller;

import com.abir.Backend.entity.LicenseStatus;
import com.abir.Backend.repository.LicenseRepository;
import com.abir.Backend.repository.VendingZoneRepository;
import com.abir.Backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/vendor/dashboard")
@RequiredArgsConstructor
public class VendorDashboardController {

    private final LicenseRepository licenseRepository;
    private final VendingZoneRepository zoneRepository;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        var vendor = SecurityUtils.currentUser();
        var licenses = licenseRepository.findByVendorIdOrderByCreatedAtDesc(vendor.getId());
        long active = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.ACTIVE).count();
        long expired = licenses.stream().filter(l -> l.getStatus() == LicenseStatus.EXPIRED).count();
        return Map.of(
                "totalLicenses", licenses.size(),
                "activeLicenses", active,
                "expiredLicenses", expired,
                "totalZones", zoneRepository.findByActiveTrue().size()
        );
    }
}
