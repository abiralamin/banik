package com.abir.Backend.dto.zone;

import java.math.BigDecimal;

public record ZoneResponse(
        Long id,
        String name,
        String area,
        String zoneType,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal dimensionsSqm,
        int totalSpots,
        int occupiedSpots,
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
        BigDecimal priceAnnual,
        String status
) {}
