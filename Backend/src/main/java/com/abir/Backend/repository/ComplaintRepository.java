package com.abir.Backend.repository;

import com.abir.Backend.entity.Complaint;
import com.abir.Backend.entity.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
    List<Complaint> findByLicenseIdOrderByCreatedAtDesc(Long licenseId);
    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);
    Optional<Complaint> findByTrackingNumber(String trackingNumber);
}
