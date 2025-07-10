package com.cashback.gold.dto;

import lombok.Data;

@Data
public class AdminProfileUpdateRequest {
    private String firstName; // ✅ NEW
    private String lastName;  // ✅ NEW
    private String email;
    private String phone;
    private String countryCode;
    private String role;
}

