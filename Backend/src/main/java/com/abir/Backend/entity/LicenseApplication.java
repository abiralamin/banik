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
@Table(name = "license_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicenseApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private User vendor;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String address;

    @Column(name = "business_name", nullable = false)
    private String businessName;
    @Column(name = "business_type")
    private String businessType;
    @Column(name = "stall_dimensions")
    private String stallDimensions;
    @Column(name = "operating_hours")
    private String operatingHours;
    @Column(name = "facilities")
    private String facilities;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_zone_id", nullable = false)
    private VendingZone primaryZone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alternate_zone_id")
    private VendingZone alternateZone;

    @Enumerated(EnumType.STRING)
    @Column(name = "license_type", nullable = false, length = 20)
    private LicenseType licenseType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Column(name = "rejection_reason")
    private String rejectionReason;
    @Column(name = "admin_notes")
    private String adminNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(name = "documents_verified")
    @Builder.Default
    private boolean documentsVerified = false;
    @Column(name = "background_check_done")
    @Builder.Default
    private boolean backgroundCheckDone = false;
    @Column(name = "zone_availability_checked")
    @Builder.Default
    private boolean zoneAvailabilityChecked = false;
    @Column(name = "fee_paid")
    @Builder.Default
    private boolean feePaid = false;

    @Column(name = "location_lat", precision = 15, scale = 10)
    private java.math.BigDecimal locationLat;
    @Column(name = "location_lng", precision = 15, scale = 10)
    private java.math.BigDecimal locationLng;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        submittedAt = LocalDateTime.now();
        updatedAt = submittedAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
