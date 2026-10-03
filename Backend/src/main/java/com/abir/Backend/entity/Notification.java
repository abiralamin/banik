package com.abir.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "body", nullable = false, columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TargetType targetType = TargetType.ALL;

    @Column(name = "target_value", length = 100)
    private String targetValue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Column(name = "channel_email", nullable = false)
    @Builder.Default
    private boolean channelEmail = true;

    @Column(name = "channel_sms", nullable = false)
    @Builder.Default
    private boolean channelSms = false;

    @Column(name = "channel_inapp", nullable = false)
    @Builder.Default
    private boolean channelInapp = true;

    @Column(name = "scheduled_at")
    private LocalDateTime scheduledAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "is_template", nullable = false)
    @Builder.Default
    private boolean isTemplate = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}