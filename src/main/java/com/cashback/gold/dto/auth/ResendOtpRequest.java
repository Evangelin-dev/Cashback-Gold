package com.cashback.gold.dto.auth;

import lombok.Data;

@Data
public class ResendOtpRequest {
    private String identifier; // email or mobile
}
