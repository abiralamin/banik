package com.abir.Backend.dto.vendor;

import java.time.LocalDate;

public record VendorProfileResponse(
        String email,
        String fullName,
        String gender,
        LocalDate dateOfBirth,
        String address,
        String phone,
        String nationalIdNumber,
        int profileCompletion,
        boolean deactivationRequested,
        boolean genderLocked
) {}
