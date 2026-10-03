package com.abir.Backend.dto.auth;

public record AuthResponse(
        String token,
        String email,
        String role
) {}
