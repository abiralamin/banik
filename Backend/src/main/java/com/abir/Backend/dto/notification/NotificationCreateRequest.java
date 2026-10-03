package com.abir.Backend.dto.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationCreateRequest(
        @NotBlank String title,
        @NotBlank String body,
        @NotNull String category,
        @NotNull String targetType,
        String targetValue,
        @NotNull String priority,
        boolean channelEmail,
        boolean channelSms,
        boolean channelInapp
) {}