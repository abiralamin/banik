package com.abir.Backend.repository;

import com.abir.Backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByIsTemplateFalseOrderByCreatedAtDesc();
    List<Notification> findByCreatedByIsNullAndIsTemplateFalseOrderByCreatedAtDesc();
}