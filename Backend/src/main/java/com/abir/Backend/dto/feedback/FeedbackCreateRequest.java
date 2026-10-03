package com.abir.Backend.dto.feedback;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FeedbackCreateRequest(
        @NotNull @Min(1) @Max(5) Integer rating,
        String message,
        String featureRequest,
        boolean isAnonymous
) {}