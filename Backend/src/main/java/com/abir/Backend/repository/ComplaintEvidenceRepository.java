package com.abir.Backend.repository;

import com.abir.Backend.entity.ComplaintEvidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintEvidenceRepository extends JpaRepository<ComplaintEvidence, Long> {
    List<ComplaintEvidence> findByComplaintId(Long complaintId);
}
