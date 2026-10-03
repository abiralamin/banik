package com.abir.Backend.dto.license;

import jakarta.validation.constraints.NotBlank;

public record RevokeRequest(@NotBlank String reason) {}
