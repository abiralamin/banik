package com.abir.Backend.repository;

import com.abir.Backend.entity.License;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LicenseRepository extends JpaRepository<License, Long> {
    @EntityGraph(attributePaths = {"application"})
    List<License> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
    
    @EntityGraph(attributePaths = {"application"})
    Optional<License> findByLicenseNumber(String licenseNumber);
    
    Optional<License> findByApplicationId(Long applicationId);
    List<License> findByValidityEndBetween(LocalDate start, LocalDate end);
    long countByStatus(com.abir.Backend.entity.LicenseStatus status);
    
    @EntityGraph(attributePaths = {"application"})
    Optional<License> findById(Long id);
}
