package com.abir.Backend.service;

import com.abir.Backend.dto.vendor.VendorProfileResponse;
import com.abir.Backend.dto.vendor.VendorProfileUpdateRequest;
import com.abir.Backend.entity.Gender;
import com.abir.Backend.entity.User;
import com.abir.Backend.entity.VendorProfile;
import com.abir.Backend.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VendorProfileService {

    private final VendorProfileRepository vendorProfileRepository;

    @Transactional
    public VendorProfileResponse getOrCreate(User user) {
        VendorProfile profile = vendorProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> vendorProfileRepository.save(VendorProfile.builder().user(user).build()));
        return toResponse(user, profile);
    }

    @Transactional
    public VendorProfileResponse update(User user, VendorProfileUpdateRequest request) {
        VendorProfile profile = vendorProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> VendorProfile.builder().user(user).build());

        profile.setFullName(request.fullName());
        
        // Only allow gender to be set if it's not already set (lock after initial selection)
        if (profile.getGender() == null && request.gender() != null && !request.gender().isBlank()) {
            profile.setGender(Gender.valueOf(request.gender().toUpperCase()));
        }
        
        profile.setDateOfBirth(request.dateOfBirth());
        profile.setAddress(request.address());
        profile.setPhone(request.phone());
        profile.setNationalIdNumber(request.nationalIdNumber());
        profile.setProfileCompletion(computeCompletion(profile));

        profile = vendorProfileRepository.save(profile);
        return toResponse(user, profile);
    }

    @Transactional
    public void requestDeactivation(User user) {
        VendorProfile profile = vendorProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> VendorProfile.builder().user(user).build());
        profile.setDeactivationRequested(true);
        vendorProfileRepository.save(profile);
    }

    private int computeCompletion(VendorProfile p) {
        int requiredFields = 6;
        int filled = 0;
        
        if (p.getFullName() != null && !p.getFullName().isBlank()) filled++;
        if (p.getGender() != null) filled++;
        if (p.getDateOfBirth() != null) filled++;
        if (p.getPhone() != null && !p.getPhone().isBlank()) filled++;
        if (p.getAddress() != null && !p.getAddress().isBlank()) filled++;
        if (p.getNationalIdNumber() != null && !p.getNationalIdNumber().isBlank()) filled++;
        
        return (int) Math.round((filled * 100.0) / requiredFields);
    }

    private VendorProfileResponse toResponse(User user, VendorProfile p) {
        return new VendorProfileResponse(user.getEmail(), p.getFullName(),
                p.getGender() == null ? null : p.getGender().name(), p.getDateOfBirth(), p.getAddress(), p.getPhone(),
                p.getNationalIdNumber(), p.getProfileCompletion(),
                p.isDeactivationRequested(), p.getGender() != null);
    }
}
