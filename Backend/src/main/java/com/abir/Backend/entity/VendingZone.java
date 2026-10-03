package com.abir.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vending_zones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendingZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String area;

    @Column(name = "zone_type")
    private String zoneType;

    private String description;

    @Column(name = "latitude", precision = 15, scale = 10)
    private java.math.BigDecimal latitude;
    @Column(name = "longitude", precision = 15, scale = 10)
    private java.math.BigDecimal longitude;

    @Column(name = "dimensions_sqm")
    private BigDecimal dimensionsSqm;

    @Column(name = "total_spots")
    @Builder.Default
    private int totalSpots = 0;

    @Column(name = "occupied_spots")
    @Builder.Default
    private int occupiedSpots = 0;

    @Column(name = "has_electricity")
    @Builder.Default
    private boolean hasElectricity = false;
    @Column(name = "has_water")
    @Builder.Default
    private boolean hasWater = false;
    @Column(name = "has_shade")
    @Builder.Default
    private boolean hasShade = false;

    @Column(name = "nearby_landmarks")
    private String nearbyLandmarks;
    @Column(name = "operating_hours")
    private String operatingHours;
    private String rules;

    @Column(name = "supervisor_name")
    private String supervisorName;
    @Column(name = "supervisor_contact")
    private String supervisorContact;

    @Column(name = "price_daily")
    @Builder.Default
    private BigDecimal priceDaily = BigDecimal.ZERO;
    @Column(name = "price_weekly")
    @Builder.Default
    private BigDecimal priceWeekly = BigDecimal.ZERO;
    @Column(name = "price_monthly")
    @Builder.Default
    private BigDecimal priceMonthly = BigDecimal.ZERO;
    @Column(name = "price_annual")
    @Builder.Default
    private BigDecimal priceAnnual = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ZoneStatus status = ZoneStatus.AVAILABLE;

    @Column(name = "is_active")
    @Builder.Default
    private boolean active = true;

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
