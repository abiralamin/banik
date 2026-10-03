package com.abir.Backend.dto.women;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        String userName,
        String content,
        LocalDateTime createdAt
) {}
