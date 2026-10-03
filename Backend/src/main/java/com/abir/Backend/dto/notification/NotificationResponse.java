package com.abir.Backend.dto.notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String body,
        String category,
        String priority,
        boolean isRead,
        LocalDateTime readAt,
        LocalDateTime createdAt
) {}