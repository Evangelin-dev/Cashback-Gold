package com.cashback.gold.dto.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String role; // "USER", "PARTNER", "B2B"
    private String password;
}