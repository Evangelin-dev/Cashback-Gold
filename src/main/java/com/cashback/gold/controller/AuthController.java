package com.cashback.gold.controller;

import com.cashback.gold.dto.auth.*;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.OtpService;
import com.cashback.gold.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse> resendOtp(@RequestBody ResendOtpRequest request) {
        return ResponseEntity.ok(authService.resendOtp(request));
    }

//    @PostMapping("/login-otp")
//    public ResponseEntity<LoginResponse> loginWithOtp(@RequestBody OtpLoginRequest request) {
//        return ResponseEntity.ok(authService.loginWithOtp(request));
//    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginWithEmailPassword(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginWithEmailPassword(request));
    }

    @PostMapping("/login-otp")
    public ResponseEntity<?> sendLoginOtp(@RequestBody OtpLoginRequest request) {
        otpService.sendOtp(request.getIdentifier());
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @PostMapping("/verify-otp2")
    public ResponseEntity<LoginResponse> verifyLoginOtp(@RequestBody OtpVerifyLoginRequest request) {
        return ResponseEntity.ok(authService.verifyLoginOtp(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.logout(authHeader));
    }}

