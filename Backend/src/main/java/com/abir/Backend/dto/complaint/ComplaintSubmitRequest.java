package com.abir.Backend.dto.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ComplaintSubmitRequest(
        @NotNull Long licenseId,
        @NotBlank String subject,
        @NotBlank String category,
        @NotBlank String description,
        String priority,
        boolean anonymous
) {}
