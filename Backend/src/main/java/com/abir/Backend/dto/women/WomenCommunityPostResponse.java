package com.abir.Backend.dto.women;

import java.time.LocalDateTime;
import java.util.List;

public record WomenCommunityPostResponse(
        Long id,
        String vendorName,
        String title,
        String content,
        boolean isSuccessStory,
        LocalDateTime createdAt,
        long likesCount,
        long commentsCount,
        boolean isLikedByCurrentUser,
        List<CommentResponse> comments
) {}