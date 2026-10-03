package com.abir.Backend.repository;

import com.abir.Backend.entity.NotificationRecipient;
import com.abir.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, Long> {
    List<NotificationRecipient> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<NotificationRecipient> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
    long countByUserIdAndIsReadFalse(Long userId);
}