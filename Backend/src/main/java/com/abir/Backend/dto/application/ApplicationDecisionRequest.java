package com.abir.Backend.dto.application;

import com.abir.Backend.dto.LocationCoordinates;
import jakarta.validation.constraints.NotBlank;

public record ApplicationDecisionRequest(
        @NotBlank String action, // APPROVE, REJECT, REQUEST_MORE_INFO
        String reason,
        String notes,
        LocationCoordinates location // Coordinates for vendor's assigned location (rectangle)
) {}
