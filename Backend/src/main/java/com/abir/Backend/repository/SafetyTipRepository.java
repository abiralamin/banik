package com.abir.Backend.repository;

import com.abir.Backend.entity.SafetyTip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SafetyTipRepository extends JpaRepository<SafetyTip, Long> {
    List<SafetyTip> findByIsActiveTrueOrderByCreatedAtDesc();
}