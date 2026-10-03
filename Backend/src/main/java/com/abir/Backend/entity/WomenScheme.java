package com.abir.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "women_schemes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WomenScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(name = "application_process", columnDefinition = "TEXT")
    private String applicationProcess;

    @Column(name = "deadline")
    private String deadline;

    @Column(name = "contact_info", length = 500)
    private String contactInfo;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

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