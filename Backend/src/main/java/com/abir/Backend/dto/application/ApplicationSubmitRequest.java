package com.abir.Backend.dto.application;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ApplicationSubmitRequest(
        // Step 1 - Personal info
        @NotBlank String fullName,
        String gender,
        LocalDate dateOfBirth,
        String address,
        // Step 2 - Zone selection
        @NotNull Long primaryZoneId,
        Long alternateZoneId,
        @NotBlank String businessName,
        String businessType,
        String stallSize,
        String operatingHour,
        String facilities,
        // Step 3 - License type
        @NotBlank String licenseType
) {}
