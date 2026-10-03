package com.abir.Backend.dto.women;

import java.time.LocalDateTime;

public record SafetyTipResponse(
        Long id,
        String title,
        String content,
        String tipCategory,
        String emergencyContact,
        boolean isActive,
        LocalDateTime createdAt
) {}