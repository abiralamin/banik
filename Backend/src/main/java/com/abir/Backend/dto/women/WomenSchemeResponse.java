package com.abir.Backend.dto.women;

import java.time.LocalDateTime;

public record WomenSchemeResponse(
        Long id,
        String title,
        String description,
        String benefits,
        String eligibilityCriteria,
        String applicationProcess,
        String deadline,
        String contactInfo,
        boolean isActive,
        LocalDateTime createdAt
) {}