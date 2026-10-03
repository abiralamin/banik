package com.abir.Backend.dto.zone;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ZoneRequest(
        @NotBlank String name,
        @NotBlank String area,
        String zoneType,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal dimensionsSqm,
        @NotNull Integer totalSpots,
        boolean hasElectricity,
        boolean hasWater,
        boolean hasShade,
        String nearbyLandmarks,
        String operatingHours,
        String rules,
        String supervisorName,
        String supervisorContact,
        BigDecimal priceDaily,
        BigDecimal priceWeekly,
        BigDecimal priceMonthly,
        BigDecimal priceAnnual
) {}
