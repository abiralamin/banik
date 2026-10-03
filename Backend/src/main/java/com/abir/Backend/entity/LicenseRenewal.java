package com.abir.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "license_renewals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicenseRenewal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "license_id", nullable = false)
    private License license;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RenewalPeriod period;

    @Column(nullable = false)
    private BigDecimal fee;

    @Builder.Default
    private BigDecimal discount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RenewalStatus status = RenewalStatus.PENDING;

    @Column(name = "new_validity_end")
    private LocalDate newValidityEnd;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @PrePersist
    void onCreate() {
        requestedAt = LocalDateTime.now();
    }
}
