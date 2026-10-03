package com.abir.Backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abir.Backend.dto.license.LicenseIssueRequest;
import com.abir.Backend.dto.license.LicenseResponse;
import com.abir.Backend.dto.license.RevokeRequest;
import com.abir.Backend.service.LicenseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/licenses")
@RequiredArgsConstructor
public class AdminLicenseController {

    private final LicenseService licenseService;

    @PostMapping("/issue")
    public LicenseResponse issue(@Valid @RequestBody LicenseIssueRequest request) {
        return licenseService.issue(request);
    }

    @GetMapping("/{id}")
    public LicenseResponse get(@PathVariable Long id) {
        return licenseService.adminGet(id);
    }

    @PostMapping("/{id}/revoke")
    public ResponseEntity<Void> revoke(@PathVariable Long id, @Valid @RequestBody RevokeRequest request) {
        licenseService.revoke(id, request.reason());
        return ResponseEntity.ok().build();
    }
}
