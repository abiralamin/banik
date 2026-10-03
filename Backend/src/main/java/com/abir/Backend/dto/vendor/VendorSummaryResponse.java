package com.abir.Backend.dto.vendor;

public record VendorSummaryResponse(
        Long id,
        String email,
        String fullName,
        String businessName,
        String phone,
        boolean active,
        int totalLicenses,
        int activeLicenses,
        int totalApplications,
        int totalComplaints
) {}
