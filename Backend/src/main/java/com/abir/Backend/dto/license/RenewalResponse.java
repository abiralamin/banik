package com.abir.Backend.dto.license;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RenewalResponse(
        Long id,
        String period,
        BigDecimal fee,
        BigDecimal discount,
        String status,
        LocalDate newValidityEnd
) {}
