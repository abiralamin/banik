package com.abir.Backend.dto.license;

import com.abir.Backend.dto.LocationCoordinates;
import java.time.LocalDate;

public record LicenseResponse(
        Long id,
        String licenseNumber,
        String vendorName,
        String zoneName,
        String licenseType,
        String category,
        String authorizedGoods,
        LocalDate issueDate,
        LocalDate validityStart,
        LocalDate validityEnd,
        String status,
        String qrCodeData,
        boolean autoRenew,
        boolean lostReported,
        long daysUntilExpiry,
        LocationCoordinates location,
        String businessName,
        String stallDimensions,
        String operatingHours,
        String facilities
) {}
