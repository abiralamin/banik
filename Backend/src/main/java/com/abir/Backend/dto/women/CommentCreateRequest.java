package com.abir.Backend.dto.women;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateRequest(
        @NotBlank(message = "Comment content is required")
        String content
) {}
