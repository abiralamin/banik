package com.abir.Backend.dto.complaint;

import java.time.LocalDateTime;

public record ComplaintResponse(
        Long id,
        Long licenseId,
        String licenseNumber,
        String zoneName,
        String trackingNumber,
        String subject,
        String category,
        String description,
        String priority,
        boolean anonymous,
        String status,
        LocalDateTime createdAt
) {}
