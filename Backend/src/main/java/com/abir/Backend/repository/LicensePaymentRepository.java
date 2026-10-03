package com.abir.Backend.repository;

import com.abir.Backend.entity.LicensePayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicensePaymentRepository extends JpaRepository<LicensePayment, Long> {
}
