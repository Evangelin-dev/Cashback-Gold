package com.cashback.gold.dto.auth;

import lombok.Data;

@Data
public class OtpVerifyLoginRequest {
    private String identifier;
    private String otp;
}
