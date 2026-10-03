package com.abir.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "full_name", length = 150)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String address;
    private String phone;

    @Column(name = "business_name")
    private String businessName;
    @Column(name = "business_type")
    private String businessType;
    @Column(name = "stall_dimensions")
    private String stallDimensions;
    @Column(name = "operating_hours")
    private String operatingHours;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;
    @Column(name = "bank_name")
    private String bankName;
    @Column(name = "national_id_number")
    private String nationalIdNumber;

    @Column(name = "profile_completion")
    @Builder.Default
    private int profileCompletion = 0;

    @Column(name = "deactivation_requested")
    @Builder.Default
    private boolean deactivationRequested = false;

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
