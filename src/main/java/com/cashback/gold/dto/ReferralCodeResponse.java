package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReferralCodeResponse {
    private Long userId;
    private String referralCode;
}
