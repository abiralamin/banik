package com.abir.Backend.dto.vendor;

import java.time.LocalDate;

public record VendorProfileUpdateRequest(
        String fullName,
        String gender,
        LocalDate dateOfBirth,
        String address,
        String phone,
        String nationalIdNumber
) {}
