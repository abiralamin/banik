package com.abir.Backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "licenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class License {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private LicenseApplication application;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vendor_id", nullable = false)
    private User vendor;

    @Column(name = "license_number", nullable = false, unique = true, length = 50)
    private String licenseNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "zone_id", nullable = false)
    private VendingZone zone;

    @Enumerated(EnumType.STRING)
    @Column(name = "license_type", nullable = false, length = 20)
    private LicenseType licenseType;

    private String category;

    @Column(name = "authorized_goods")
    private String authorizedGoods;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;
    @Column(name = "validity_start", nullable = false)
    private LocalDate validityStart;
    @Column(name = "validity_end", nullable = false)
    private LocalDate validityEnd;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LicenseStatus status = LicenseStatus.ACTIVE;

    @Column(name = "qr_code_data", columnDefinition = "LONGTEXT")
    private String qrCodeData;

    @Column(name = "auto_renew")
    @Builder.Default
    private boolean autoRenew = false;

    @Column(name = "lost_reported")
    @Builder.Default
    private boolean lostReported = false;

    @Column(name = "location_lat", precision = 15, scale = 10)
    private java.math.BigDecimal locationLat;
    @Column(name = "location_lng", precision = 15, scale = 10)
    private java.math.BigDecimal locationLng;

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
