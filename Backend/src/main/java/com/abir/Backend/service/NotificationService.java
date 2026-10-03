package com.abir.Backend.service;

import com.abir.Backend.dto.notification.NotificationResponse;
import com.abir.Backend.entity.*;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.NotificationRecipientRepository;
import com.abir.Backend.repository.NotificationRepository;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.repository.VendingZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final UserRepository userRepository;
    private final VendingZoneRepository zoneRepository;
    private final EmailClientService emailClientService;

    public List<NotificationResponse> getMyNotifications(User user) {
        List<NotificationRecipient> recipients = recipientRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return recipients.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<NotificationResponse> getUnreadNotifications(User user) {
        List<NotificationRecipient> recipients = recipientRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        return recipients.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(User user) {
        return recipientRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(User user, Long notificationId) {
        NotificationRecipient recipient = recipientRepository.findById(notificationId)
                .orElseThrow(() -> ApiException.notFound("Notification not found"));
        
        if (!recipient.getUser().getId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have access to this notification");
        }
        
        recipient.setRead(true);
        recipient.setReadAt(LocalDateTime.now());
        recipientRepository.save(recipient);
    }

    @Transactional
    public void markAllAsRead(User user) {
        List<NotificationRecipient> unread = recipientRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        unread.forEach(r -> {
            r.setRead(true);
            r.setReadAt(LocalDateTime.now());
        });
        recipientRepository.saveAll(unread);
    }

    @Transactional
    public void deleteNotification(User user, Long notificationId) {
        NotificationRecipient recipient = recipientRepository.findById(notificationId)
                .orElseThrow(() -> ApiException.notFound("Notification not found"));
        
        if (!recipient.getUser().getId().equals(user.getId())) {
            throw ApiException.forbidden("You do not have access to this notification");
        }
        
        recipientRepository.delete(recipient);
    }

    @Transactional
    public void sendNotification(Notification notification, List<User> targetUsers) {
        notification.setSentAt(LocalDateTime.now());
        notification = notificationRepository.save(notification);

        for (User user : targetUsers) {
            NotificationRecipient recipient = NotificationRecipient.builder()
                    .notification(notification)
                    .user(user)
                    .deliveredAt(LocalDateTime.now())
                    .build();
            recipientRepository.save(recipient);

            if (notification.isChannelEmail()) {
                emailClientService.sendNotificationEmail(
                        user.getEmail(),
                        notification.getTitle(),
                        notification.getBody()
                );
            }
        }
    }

    private NotificationResponse toResponse(NotificationRecipient recipient) {
        Notification notification = recipient.getNotification();
        return new NotificationResponse(
                recipient.getId(),
                notification.getTitle(),
                notification.getBody(),
                notification.getCategory().name(),
                notification.getPriority().name(),
                recipient.isRead(),
                recipient.getReadAt(),
                recipient.getCreatedAt()
        );
    }
}