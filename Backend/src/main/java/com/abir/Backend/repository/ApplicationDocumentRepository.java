package com.abir.Backend.repository;

import com.abir.Backend.entity.ApplicationDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, Long> {
    List<ApplicationDocument> findByApplicationId(Long applicationId);
}
