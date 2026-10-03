package com.abir.Backend.repository;

import com.abir.Backend.entity.LicenseRenewal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LicenseRenewalRepository extends JpaRepository<LicenseRenewal, Long> {
    List<LicenseRenewal> findByLicenseIdOrderByRequestedAtDesc(Long licenseId);
}
