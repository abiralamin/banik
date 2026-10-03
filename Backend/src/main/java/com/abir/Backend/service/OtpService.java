package com.abir.Backend.service;

import com.abir.Backend.entity.OtpCode;
import com.abir.Backend.entity.OtpPurpose;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.OtpCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int OTP_LENGTH = 6;
    private static final int EXPIRY_MINUTES = 10;

    private final OtpCodeRepository otpCodeRepository;
    private final BCryptPasswordEncoder otpEncoder = new BCryptPasswordEncoder();

    @Transactional
    public String generateAndStore(Long userId, OtpPurpose purpose) {
        // Invalidate any previous unused codes for this purpose so only the latest is valid.
        List<OtpCode> previous = otpCodeRepository.findByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(userId, purpose);
        previous.forEach(o -> o.setUsed(true));
        otpCodeRepository.saveAll(previous);

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        OtpCode otp = OtpCode.builder()
                .userId(userId)
                .codeHash(otpEncoder.encode(code))
                .purpose(purpose)
                .expiresAt(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES))
                .used(false)
                .build();
        otpCodeRepository.save(otp);
        return code;
    }

    @Transactional
    public void verify(Long userId, OtpPurpose purpose, String code) {
        List<OtpCode> candidates = otpCodeRepository.findByUserIdAndPurposeAndUsedFalseOrderByCreatedAtDesc(userId, purpose);
        OtpCode match = candidates.stream()
                .filter(o -> !o.isUsed() && o.getExpiresAt().isAfter(LocalDateTime.now()) && otpEncoder.matches(code, o.getCodeHash()))
                .findFirst()
                .orElseThrow(() -> ApiException.badRequest("Invalid or expired OTP code"));
        match.setUsed(true);
        otpCodeRepository.save(match);
    }
}
