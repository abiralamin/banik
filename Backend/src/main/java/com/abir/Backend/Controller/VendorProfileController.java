package com.abir.Backend.Controller;

import com.abir.Backend.dto.auth.ChangePasswordRequest;
import com.abir.Backend.dto.vendor.VendorProfileResponse;
import com.abir.Backend.dto.vendor.VendorProfileUpdateRequest;
import com.abir.Backend.entity.User;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.security.SecurityUtils;
import com.abir.Backend.service.VendorProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendor/profile")
@RequiredArgsConstructor
public class VendorProfileController {

    private final VendorProfileService vendorProfileService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public VendorProfileResponse get() {
        return vendorProfileService.getOrCreate(SecurityUtils.currentUser());
    }

    @PutMapping
    public VendorProfileResponse update(@RequestBody VendorProfileUpdateRequest request) {
        return vendorProfileService.update(SecurityUtils.currentUser(), request);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = userRepository.findById(SecurityUtils.currentUser().getId()).orElseThrow();
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/deactivate")
    public ResponseEntity<Void> requestDeactivation() {
        vendorProfileService.requestDeactivation(SecurityUtils.currentUser());
        return ResponseEntity.ok().build();
    }
}
