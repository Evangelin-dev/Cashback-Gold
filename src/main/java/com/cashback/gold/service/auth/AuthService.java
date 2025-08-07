package com.cashback.gold.service.auth;

import com.cashback.gold.dto.auth.*;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.entity.OtpVerification;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.OtpVerificationRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.service.OtpService;
import com.cashback.gold.service.email.EmailService;
import com.cashback.gold.service.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final OtpVerificationRepository otpRepo;
    private final EmailService emailService;
    private final UserRepository userRepo;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public ApiResponse register(RegisterRequest request) {
        String identifier = request.getEmail();

        // Validate required fields
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new InvalidArgumentException("Name is required");
        }
        if (request.getGender() == null || request.getGender().trim().isEmpty()) {
            throw new InvalidArgumentException("Gender is required");
        }
        if (request.getDob() == null) {
            throw new InvalidArgumentException("Date of birth is required");
        }
        if (request.getEmail() == null || !request.getEmail().matches("^\\S+@\\S+\\.\\S+$")) {
            throw new InvalidArgumentException("Valid email is required");
        }
        if (request.getMobile() == null || request.getMobile().length() < 8 || request.getMobile().length() > 15) {
            throw new InvalidArgumentException("Valid phone number (8-15 digits) is required");
        }
        if (request.getCountryCode() == null || request.getCountryCode().trim().isEmpty()) {
            throw new InvalidArgumentException("Country code is required");
        }
        if (request.getCity() == null || request.getCity().trim().isEmpty()) {
            throw new InvalidArgumentException("City is required");
        }
        if (request.getTown() == null || request.getTown().trim().isEmpty()) {
            throw new InvalidArgumentException("Town is required");
        }
        if (request.getState() == null || request.getState().trim().isEmpty()) {
            throw new InvalidArgumentException("State is required");
        }
        if (request.getCountry() == null || request.getCountry().trim().isEmpty()) {
            throw new InvalidArgumentException("Country is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new InvalidArgumentException("Password must be at least 6 characters");
        }

        // Prevent duplicate user registration
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new InvalidArgumentException("Email already registered");
        }
        String fullMobile = request.getCountryCode() + request.getMobile();
        if (userRepo.findByMobile(fullMobile).isPresent()) {
            throw new InvalidArgumentException("Mobile number already registered");
        }

        // Delete existing unverified OTP (if any)
        otpRepo.findTopByIdentifierAndVerifiedFalseOrderByIdDesc(identifier)
                .ifPresent(otpRepo::delete);

        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        OtpVerification otpRecord = OtpVerification.builder()
                .identifier(identifier)
                .otp(otp)
                .expiresAt(expiry)
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();

        otpRepo.save(otpRecord);

        emailService.sendOtpEmail(request.getEmail(), otp);

        return new ApiResponse(true, "OTP sent successfully");
    }

    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
    }

    @Transactional
    public ApiResponse verifyOtp(OtpVerifyRequest request) {
        String identifier = request.getIdentifier();
        String otp = request.getOtp();

        // Validate required fields
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new InvalidArgumentException("Name is required");
        }
        if (request.getGender() == null || request.getGender().trim().isEmpty()) {
            throw new InvalidArgumentException("Gender is required");
        }
        if (request.getDob() == null) {
            throw new InvalidArgumentException("Date of birth is required");
        }
        if (request.getMobile() == null || request.getMobile().length() < 8 || request.getMobile().length() > 15) {
            throw new InvalidArgumentException("Valid phone number (8-15 digits) is required");
        }
        if (request.getCountryCode() == null || request.getCountryCode().trim().isEmpty()) {
            throw new InvalidArgumentException("Country code is required");
        }
        if (request.getCity() == null || request.getCity().trim().isEmpty()) {
            throw new InvalidArgumentException("City is required");
        }
        if (request.getTown() == null || request.getTown().trim().isEmpty()) {
            throw new InvalidArgumentException("Town is required");
        }
        if (request.getState() == null || request.getState().trim().isEmpty()) {
            throw new InvalidArgumentException("State is required");
        }
        if (request.getCountry() == null || request.getCountry().trim().isEmpty()) {
            throw new InvalidArgumentException("Country is required");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new InvalidArgumentException("Password must be at least 6 characters");
        }

        // Find latest unverified OTP
        OtpVerification otpVerification = otpRepo.findTopByIdentifierAndVerifiedFalseOrderByIdDesc(identifier)
                .orElseThrow(() -> new InvalidArgumentException("OTP not found or already verified"));

        if (!otpVerification.getOtp().equals(otp)) {
            return new ApiResponse(false, "Invalid OTP");
        }

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ApiResponse(false, "OTP has expired");
        }

        // Prevent duplicate registration
        if (userRepo.findByEmail(identifier).isPresent()) {
            return new ApiResponse(false, "Email already registered");
        }
        String fullMobile = request.getCountryCode() + request.getMobile();
        if (userRepo.findByMobile(fullMobile).isPresent()) {
            return new ApiResponse(false, "Mobile number already registered");
        }

        // Check for referral code and extract partner ID
        Long referredBy = null;
        if (request.getReferralCode() != null && request.getReferralCode().startsWith("PARTNER-")) {
            try {
                Long partnerId = Long.parseLong(request.getReferralCode().substring(8));
                if (userRepo.findById(partnerId).isPresent()) {
                    referredBy = partnerId;
                }
            } catch (NumberFormatException ignored) {
            }
        }

        // Save new user
        User user = User.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .dob(request.getDob())
                .email(identifier)
                .mobile(fullMobile)
                .countryCode(request.getCountryCode())
                .city(request.getCity())
                .town(request.getTown())
                .state(request.getState())
                .country(request.getCountry())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : "USER")
                .status("PENDING")
                .referredBy(referredBy) // ✅ Save referrer
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepo.save(user);

        // ✅ Set referral code for PARTNER after saving (based on user ID)
        if ("PARTNER".equalsIgnoreCase(user.getRole())) {
            String referralCode = "PARTNER-" + user.getId();
            user.setReferralCode(referralCode);
            userRepo.save(user); // update with referral code
        }

//        // Mark OTP verified
//        otpVerification.setVerified(true);
//        otpRepo.save(otpVerification);

        // Mark OTP verified and delete entry from OTP table
        otpRepo.delete(otpVerification);

        return new ApiResponse(true, "User registered successfully. Awaiting admin approval.");
    }

    public ApiResponse resendOtp(ResendOtpRequest request) {
        String identifier = request.getIdentifier();

        // Delete existing unverified OTP (if any)
        otpRepo.findByIdentifierAndVerifiedFalse(identifier)
                .ifPresent(otpRepo::delete);

        // Generate new OTP
        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);

        OtpVerification otpRecord = OtpVerification.builder()
                .identifier(identifier)
                .otp(otp)
                .expiresAt(expiry)
                .verified(false)
                .build();

        otpRepo.save(otpRecord);

        emailService.sendOtpEmail(identifier, otp);

        return new ApiResponse(true, "OTP resent successfully");
    }

    public LoginResponse loginWithEmailPassword(LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        if (!user.getStatus().equalsIgnoreCase("APPROVED")) {
            throw new InvalidArgumentException("User is not approved by admin");
        }

//        if (!user.getRole().equalsIgnoreCase("ADMIN")) {
//            throw new InvalidArgumentException("Only ADMIN users are allowed to login here");
//        }

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidArgumentException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .success(true)
                .message("Login successful")
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .mobile(user.getMobile())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .build())
                .build();
    }

    public LoginResponse verifyLoginOtp(OtpVerifyLoginRequest request) {
        boolean isValid = otpService.verifyOtp(request.getIdentifier(), request.getOtp());
        if (!isValid) throw new InvalidArgumentException("Invalid or expired OTP");

        User user = userRepo.findByEmailOrMobile(request.getIdentifier(), request.getIdentifier())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        if (!user.getStatus().equalsIgnoreCase("APPROVED")) {
            throw new InvalidArgumentException("User not approved yet");
        }

        String token = jwtService.generateToken(user);
        return LoginResponse.builder()
                .success(true)
                .message("Login successful")
                .token(token)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .mobile(user.getMobile())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .build())
                .build();
    }

    public ApiResponse logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ApiResponse(false, "Invalid token header");
        }

        String token = authHeader.substring(7);
        String userId = jwtService.extractUserId(token);

        return new ApiResponse(true, "Logout successful");
    }
}