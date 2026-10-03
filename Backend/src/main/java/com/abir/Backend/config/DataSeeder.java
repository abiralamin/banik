package com.abir.Backend.config;

import com.abir.Backend.entity.Role;
import com.abir.Backend.entity.User;
import com.abir.Backend.entity.VendorProfile;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.repository.VendorProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the default admin account and a demo vendor on first startup only (idempotent).
 * Change the admin password via /api/vendor/change-password style admin settings endpoint after first login.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VendorProfileRepository vendorProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username}")
    private String adminUsername;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        String adminEmail = adminUsername + "@banik.local";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .emailVerified(true)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin account: {} (change the password after first login)", adminEmail);
        }

        String demoVendorEmail = "vendor@banik.local";
        if (userRepository.findByEmail(demoVendorEmail).isEmpty()) {
            User vendor = User.builder()
                    .email(demoVendorEmail)
                    .passwordHash(passwordEncoder.encode("Vendor@123"))
                    .role(Role.VENDOR)
                    .emailVerified(true)
                    .active(true)
                    .build();
            vendor = userRepository.save(vendor);

            VendorProfile profile = VendorProfile.builder()
                    .user(vendor)
                    .fullName("Rahim Uddin")
                    .phone("01700000000")
                    .address("House 12, Road 5, Mirpur, Dhaka")
                    .businessName("Rahim's Tea Stall")
                    .businessType("Food & Beverage")
                    .profileCompletion(60)
                    .build();
            vendorProfileRepository.save(profile);
            log.info("Seeded demo vendor account: {} / Vendor@123", demoVendorEmail);
        }
    }
}
