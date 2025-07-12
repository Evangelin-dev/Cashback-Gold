package com.cashback.gold.dto.auth;

import lombok.Data;

@Data
public class OtpLoginRequest {
    private String identifier; // Can be either email or mobile
}