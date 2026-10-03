package com.abir.Backend.repository;

import com.abir.Backend.entity.WomenScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WomenSchemeRepository extends JpaRepository<WomenScheme, Long> {
    List<WomenScheme> findByIsActiveTrueOrderByCreatedAtDesc();
    List<WomenScheme> findAllByOrderByCreatedAtDesc();
}