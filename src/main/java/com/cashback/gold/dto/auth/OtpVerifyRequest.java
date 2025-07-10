package com.cashback.gold.dto.auth;

import lombok.Data;

@Data
public class OtpVerifyRequest {
    private String identifier; // email or mobile
    private String otp;
    private String role; // USER | B2B | PARTNER
    private String firstName; // 👈 NEW
    private String lastName;  // 👈 NEW
    private String password;
}

