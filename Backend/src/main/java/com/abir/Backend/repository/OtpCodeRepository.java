package com.abir.Backend.repository;

import com.abir.Backend.entity.OtpCode;
import com.abir.Backend.entity.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    List<OtpCode> findByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(Long userId, OtpPurpose purpose);
}
