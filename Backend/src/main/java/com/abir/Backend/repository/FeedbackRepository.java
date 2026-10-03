package com.abir.Backend.repository;

import com.abir.Backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByIsAnonymousFalseOrderByCreatedAtDesc();
    List<Feedback> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}