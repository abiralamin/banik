package com.abir.Backend.service;

import com.abir.Backend.dto.auth.*;
import com.abir.Backend.entity.Gender;
import com.abir.Backend.entity.OtpPurpose;
import com.abir.Backend.entity.Role;
import com.abir.Backend.entity.User;
import com.abir.Backend.entity.VendorProfile;
import com.abir.Backend.exception.ApiException;
import com.abir.Backend.repository.UserRepository;
import com.abir.Backend.repository.VendorProfileRepository;
import com.abir.Backend.security.AuthenticatedUser;
import com.abir.Backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailClientService emailClientService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final VendorProfileRepository vendorProfileRepository;

    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw ApiException.conflict("An account with this email already exists");
        }
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.VENDOR)
                .emailVerified(false)
                .active(true)
                .build();
        user = userRepository.save(user);

        // Create vendor profile with gender from registration
        if (request.gender() != null && !request.gender().isBlank()) {
            VendorProfile profile = VendorProfile.builder()
                    .user(user)
                    .gender(Gender.valueOf(request.gender().toUpperCase()))
                    .build();
            vendorProfileRepository.save(profile);
        }

        String code = otpService.generateAndStore(user.getId(), OtpPurpose.REGISTER_VERIFY);
        emailClientService.sendOtpEmail(user.getEmail(), code, "REGISTER_VERIFY");
    }

    @Transactional
    public void resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.notFound("No account found for this email"));
        OtpPurpose purpose = "RESET_PASSWORD".equalsIgnoreCase(request.purpose())
                ? OtpPurpose.RESET_PASSWORD : OtpPurpose.REGISTER_VERIFY;
        String code = otpService.generateAndStore(user.getId(), purpose);
        emailClientService.sendOtpEmail(user.getEmail(), code, purpose.name());
    }

    @Transactional
    public AuthResponse verifyRegistration(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.notFound("No account found for this email"));
        otpService.verify(user.getId(), OtpPurpose.REGISTER_VERIFY, request.code());
        user.setEmailVerified(true);
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));
        if (user.getRole() != Role.VENDOR) {
            throw ApiException.unauthorized("Invalid email or password");
        }
        if (!user.isEmailVerified()) {
            throw ApiException.badRequest("Please verify your email with the OTP before logging in");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        return buildAuthResponse(user);
    }

    public AuthResponse adminLogin(AdminLoginRequest request) {
        String adminEmail = request.username() + "@banik.local";
        User user = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> ApiException.unauthorized("Invalid admin credentials"));
        if (user.getRole() != Role.ADMIN) {
            throw ApiException.unauthorized("Invalid admin credentials");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(adminEmail, request.password()));
        return buildAuthResponse(user);
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.notFound("No account found for this email"));
        String code = otpService.generateAndStore(user.getId(), OtpPurpose.RESET_PASSWORD);
        emailClientService.sendOtpEmail(user.getEmail(), code, "RESET_PASSWORD");
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.notFound("No account found for this email"));
        otpService.verify(user.getId(), OtpPurpose.RESET_PASSWORD, request.code());
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(user);
        String token = jwtService.generateToken(authenticatedUser, user.getRole().name());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}
