package com.abir.Backend.dto.application;

import com.abir.Backend.dto.LocationCoordinates;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ApplicationResponse(
        Long id,
        String fullName,
        String businessName,
        String primaryZoneName,
        String alternateZoneName,
        String licenseType,
        String status,
        String priority,
        String rejectionReason,
        String adminNotes,
        boolean documentsVerified,
        boolean backgroundCheckDone,
        boolean zoneAvailabilityChecked,
        boolean feePaid,
        LocalDateTime submittedAt,
        String gender,
        LocalDate dateOfBirth,
        String address,
        String businessType,
        String stallSize,
        String operatingHour,
        String facilities,
        LocationCoordinates location,
        LocationCoordinates zoneCenter
) {}
