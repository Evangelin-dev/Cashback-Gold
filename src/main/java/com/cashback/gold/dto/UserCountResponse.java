package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserCountResponse {
    private long userCount;
    private long partnerCount;
    private long b2bCount;
}
