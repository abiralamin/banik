package com.abir.Backend.Controller;

import com.abir.Backend.dto.notification.NotificationResponse;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> getMyNotifications() {
        return notificationService.getMyNotifications(SecurityUtils.currentUser());
    }

    @GetMapping("/unread")
    public List<NotificationResponse> getUnreadNotifications() {
        return notificationService.getUnreadNotifications(SecurityUtils.currentUser());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount() {
        return Map.of("count", notificationService.getUnreadCount(SecurityUtils.currentUser()));
    }

    @PostMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(SecurityUtils.currentUser(), id);
    }

    @PostMapping("/read-all")
    public void markAllAsRead() {
        notificationService.markAllAsRead(SecurityUtils.currentUser());
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(SecurityUtils.currentUser(), id);
    }
}