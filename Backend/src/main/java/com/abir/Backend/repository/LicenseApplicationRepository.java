package com.abir.Backend.repository;

import com.abir.Backend.entity.ApplicationStatus;
import com.abir.Backend.entity.LicenseApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LicenseApplicationRepository extends JpaRepository<LicenseApplication, Long> {
    List<LicenseApplication> findByVendorIdOrderBySubmittedAtDesc(Long vendorId);
    Page<LicenseApplication> findByStatus(ApplicationStatus status, Pageable pageable);
    Page<LicenseApplication> findByFullNameContainingIgnoreCase(String name, Pageable pageable);
}
