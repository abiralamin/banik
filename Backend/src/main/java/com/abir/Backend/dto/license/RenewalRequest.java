package com.abir.Backend.dto.license;

import jakarta.validation.constraints.NotBlank;

public record RenewalRequest(@NotBlank String period) {} // ONE_MONTH, THREE_MONTHS, SIX_MONTHS, ONE_YEAR
