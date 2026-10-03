package com.abir.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private User vendor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "license_id")
    private License license;

    @Column(name = "tracking_number", nullable = false, unique = true, length = 30)
    private String trackingNumber;

    @Column(nullable = false, length = 150)
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ComplaintCategory category;

    @Column(nullable = false, length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Column(name = "is_anonymous")
    @Builder.Default
    private boolean anonymous = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ComplaintStatus status = ComplaintStatus.OPEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_admin_id")
    private User assignedAdmin;

    private Integer rating;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
