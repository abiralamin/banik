package com.abir.Backend.dto.feedback;

import java.time.LocalDateTime;

public record FeedbackResponse(
        Long id,
        String vendorName,
        String vendorEmail,
        int rating,
        String message,
        String featureRequest,
        boolean isAnonymous,
        LocalDateTime createdAt
) {}