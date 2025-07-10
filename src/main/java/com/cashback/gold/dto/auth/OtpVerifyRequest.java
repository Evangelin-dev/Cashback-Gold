package com.cashback.gold.dto.auth;

import lombok.Data;
import java.time.LocalDate;

@Data
public class OtpVerifyRequest {
    private String identifier;
    private String otp;
    private String fullName;
    private String gender;
    private LocalDate dob;
    private String mobile;
    private String countryCode;
    private String city;
    private String town;
    private String state;
    private String country;
    private String password;
    private String role;
}