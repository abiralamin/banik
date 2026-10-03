package com.abir.Backend.dto.license;

import java.time.LocalDate;

// Minimal license info for public QR verification - no vendor personal details exposed.
public record LicenseVerifyResponse(
        String licenseNumber,
        String status,
        String licenseType,
        String zoneName,
        LocalDate validityStart,
        LocalDate validityEnd
) {}
