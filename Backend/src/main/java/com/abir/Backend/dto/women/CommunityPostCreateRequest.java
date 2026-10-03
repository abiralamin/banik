package com.abir.Backend.dto.women;

import jakarta.validation.constraints.NotBlank;

public record CommunityPostCreateRequest(
        @NotBlank String title,
        @NotBlank String content,
        boolean isSuccessStory
) {}