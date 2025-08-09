package com.cashback.gold.controller;

import com.cashback.gold.dto.auth.*;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.OtpService;
import com.cashback.gold.service.auth.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth Controller", description = "Authentication and OTP APIs")
public class AuthController {
    private final AuthService authService;
    private final OtpService otpService;

    @Operation(summary = "Register a new user")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Registered successfully")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Verify registration OTP")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "OTP verified")
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @Operation(summary = "Resend registration OTP")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "OTP resent")
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse> resendOtp(@RequestBody ResendOtpRequest request) {
        return ResponseEntity.ok(authService.resendOtp(request));
    }

    @Operation(summary = "Login with email & password")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logged in successfully")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginWithEmailPassword(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginWithEmailPassword(request));
    }

    @Operation(summary = "Send OTP for login")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login OTP sent")
    @PostMapping("/login-otp")
    public ResponseEntity<?> sendLoginOtp(@RequestBody OtpLoginRequest request) {
        otpService.sendOtp(request.getIdentifier());
        return ResponseEntity.ok(Map.of("message", "OTP sent"));
    }

    @Operation(summary = "Verify login OTP")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login OTP verified")
    @PostMapping("/verify-otp2")
    public ResponseEntity<LoginResponse> verifyLoginOtp(@RequestBody OtpVerifyLoginRequest request) {
        return ResponseEntity.ok(authService.verifyLoginOtp(request));
    }

    @Operation(summary = "Logout current session")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logged out")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(
            @Parameter(description = "Bearer token from Authorization header")
            @RequestHeader("Authorization") String authHeader
    ) {
        return ResponseEntity.ok(authService.logout(authHeader));
    }
}
