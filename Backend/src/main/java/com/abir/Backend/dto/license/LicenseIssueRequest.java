package com.abir.Backend.dto.license;

import jakarta.validation.constraints.NotNull;

public record LicenseIssueRequest(
        @NotNull Long applicationId,
        String category,
        String authorizedGoods
) {}
