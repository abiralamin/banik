package com.abir.Backend.dto.vendor;

import com.abir.Backend.dto.complaint.ComplaintResponse;
import com.abir.Backend.dto.license.LicenseResponse;

import java.util.List;

public record VendorDetailResponse(
        VendorProfileResponse profile,
        List<LicenseResponse> licenses,
        List<ComplaintResponse> complaints
) {}
