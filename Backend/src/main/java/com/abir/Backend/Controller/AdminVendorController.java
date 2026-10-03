package com.abir.Backend.Controller;

import com.abir.Backend.dto.vendor.VendorDetailResponse;
import com.abir.Backend.dto.vendor.VendorSummaryResponse;
import com.abir.Backend.service.AdminVendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/vendors")
@RequiredArgsConstructor
public class AdminVendorController {

    private final AdminVendorService adminVendorService;

    @GetMapping
    public List<VendorSummaryResponse> list() {
        return adminVendorService.listVendors();
    }

    @GetMapping("/{id}")
    public VendorDetailResponse get(@PathVariable Long id) {
        return adminVendorService.getVendorDetail(id);
    }
}
