package com.abir.Backend.Controller;

import com.abir.Backend.dto.notification.NotificationCreateRequest;
import com.abir.Backend.entity.*;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
public class AdminNotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @PostMapping
    public void createNotification(@Valid @RequestBody NotificationCreateRequest request) {
        User admin = SecurityUtils.currentUser();
        
        Notification notification = Notification.builder()
                .title(request.title())
                .body(request.body())
                .category(NotificationCategory.valueOf(request.category()))
                .targetType(TargetType.valueOf(request.targetType()))
                .targetValue(request.targetValue())
                .priority(Priority.valueOf(request.priority()))
                .channelEmail(request.channelEmail())
                .channelSms(request.channelSms())
                .channelInapp(request.channelInapp())
                .createdBy(admin)
                .build();

        List<User> targetUsers = determineTargetUsers(notification);
        notificationService.sendNotification(notification, targetUsers);
    }

    private List<User> determineTargetUsers(Notification notification) {
        return switch (notification.getTargetType()) {
            case ALL -> userRepository.findActiveVendors(Role.VENDOR);
            case ZONE, LICENSE_TYPE -> {
                // For now, send to all vendors - can be enhanced later with zone/license filtering
                yield userRepository.findActiveVendors(Role.VENDOR);
            }
            case INDIVIDUAL -> {
                User user = userRepository.findById(Long.parseLong(notification.getTargetValue()))
                        .orElseThrow(() -> new RuntimeException("User not found"));
                yield List.of(user);
            }
        };
    }
}