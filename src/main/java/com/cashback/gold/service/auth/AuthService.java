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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
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
        String identifier = request.getEmail() != null ? request.getEmail() : request.getMobile();

        // ✅ Prevent duplicate user registration
        if (request.getEmail() != null && userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered.");
        }

        if (request.getMobile() != null && userRepo.findByMobile(request.getMobile()).isPresent()) {
            throw new RuntimeException("Mobile number already registered.");
        }

        // ✅ Delete existing unverified OTP (if any)
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

        if (request.getEmail() != null) {
            emailService.sendOtpEmail(request.getEmail(), otp);
        } else {
            otpService.sendOtp(request.getMobile());
        }

        return new ApiResponse(true, "OTP sent successfully");
    }



    private String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
    }

    @Transactional
    public ApiResponse verifyOtp(OtpVerifyRequest request) {
        String identifier = request.getIdentifier();
        String otp = request.getOtp();

        // ✅ Find latest unverified OTP
        OtpVerification otpVerification = otpRepo.findTopByIdentifierAndVerifiedFalseOrderByIdDesc(identifier)
                .orElseThrow(() -> new RuntimeException("OTP not found or already verified"));

        if (!otpVerification.getOtp().equals(otp)) {
            return new ApiResponse(false, "Invalid OTP");
        }

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ApiResponse(false, "OTP has expired");
        }

        // ✅ Prevent duplicate registration after OTP if someone tried skipping the first check
        if (identifier.contains("@") && userRepo.findByEmail(identifier).isPresent()) {
            return new ApiResponse(false, "Email already registered.");
        }

        if (!identifier.contains("@") && userRepo.findByMobile(identifier).isPresent()) {
            return new ApiResponse(false, "Mobile already registered.");
        }

        // ✅ Save new user
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(identifier.contains("@") ? identifier : null)
                .mobile(!identifier.contains("@") ? identifier : null)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepo.save(user);

        // ✅ Mark OTP verified
        otpVerification.setVerified(true);
        otpRepo.save(otpVerification);

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

        // Send OTP via email or log (for mobile)
        if (identifier.contains("@")) {
            emailService.sendOtpEmail(identifier, otp);
        } else {
            System.out.println("Resent OTP for mobile " + identifier + ": " + otp);
        }

        return new ApiResponse(true, "OTP resent successfully");
    }

    public LoginResponse loginWithOtp(OtpLoginRequest request) {
        String identifier = request.getIdentifier();
        String otp = request.getOtp();

        OtpVerification otpVerification = otpRepo.findByIdentifierAndVerifiedFalse(identifier)
                .orElseThrow(() -> new RuntimeException("OTP not found or already verified"));

        if (!otpVerification.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (otpVerification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        // Find user
        Optional<User> optionalUser = identifier.contains("@")
                ? userRepo.findByEmail(identifier)
                : userRepo.findByMobile(identifier);

        User user = optionalUser
                .orElseThrow(() -> new RuntimeException("User not registered"));

        if (!user.getStatus().equalsIgnoreCase("approved")) {
            throw new RuntimeException("Account not approved by admin");
        }

        // Mark OTP as verified
        otpVerification.setVerified(true);
        otpRepo.save(otpVerification);

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

    public LoginResponse loginWithEmailPassword(LoginRequest request) {
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        if (!user.getStatus().equalsIgnoreCase("APPROVED")) {
            throw new InvalidArgumentException("User is not approved by admin");
        }

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
        // Optional: log logout event or store token in a blacklist
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ApiResponse(false, "Invalid token header.");
        }

        String token = authHeader.substring(7);

        // Optional: extract user for logging purposes
        String userId = jwtService.extractUserId(token);

        // ✅ Since JWT is stateless, no actual "logout" action needed
        return new ApiResponse(true, "Logout successful.");
    }


}
