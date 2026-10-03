package com.abir.Backend.dto;

import java.math.BigDecimal;

public record LocationCoordinates(
    BigDecimal lat,
    BigDecimal lng
) {}
