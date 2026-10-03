package com.abir.Backend.Controller;

import com.abir.Backend.dto.license.LicenseVerifyResponse;
import com.abir.Backend.service.LicenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/licenses")
@RequiredArgsConstructor
public class PublicLicenseController {

    private final LicenseService licenseService;

    // Used to verify a license from its QR code without exposing vendor personal details.
    @GetMapping("/verify/{licenseNumber}")
    public LicenseVerifyResponse verify(@PathVariable String licenseNumber) {
        return licenseService.verifyByLicenseNumber(licenseNumber);
    }
}
