package com.cashback.gold.dto;

import lombok.Data;

@Data
public class AdminProfileUpdateRequest {
    private String fullName;
    private String email;
    private String phone;
    private String countryCode;
    private String role;
}

