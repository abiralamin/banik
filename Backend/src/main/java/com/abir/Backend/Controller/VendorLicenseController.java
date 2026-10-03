package com.abir.Backend.Controller;

import com.abir.Backend.dto.license.LicenseResponse;
import com.abir.Backend.dto.license.RenewalRequest;
import com.abir.Backend.dto.license.RenewalResponse;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.LicenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendor/licenses")
@RequiredArgsConstructor
public class VendorLicenseController {

    private final LicenseService licenseService;

    @GetMapping
    public List<LicenseResponse> listMine() {
        return licenseService.listMine(SecurityUtils.currentUser());
    }

    @GetMapping("/{id}")
    public LicenseResponse get(@PathVariable Long id) {
        return licenseService.get(SecurityUtils.currentUser(), id);
    }

    @PostMapping("/{id}/report-lost")
    public ResponseEntity<Void> reportLost(@PathVariable Long id) {
        licenseService.reportLost(SecurityUtils.currentUser(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/auto-renew")
    public ResponseEntity<Void> toggleAutoRenew(@PathVariable Long id, @RequestParam boolean enabled) {
        licenseService.toggleAutoRenew(SecurityUtils.currentUser(), id, enabled);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/renewals")
    public RenewalResponse requestRenewal(@PathVariable Long id, @Valid @RequestBody RenewalRequest request) {
        return licenseService.requestRenewal(SecurityUtils.currentUser(), id, request);
    }

    @PostMapping("/{id}/renewals/{renewalId}/pay")
    public RenewalResponse payRenewal(@PathVariable Long id, @PathVariable Long renewalId) {
        return licenseService.confirmRenewalPayment(SecurityUtils.currentUser(), id, renewalId);
    }
}
