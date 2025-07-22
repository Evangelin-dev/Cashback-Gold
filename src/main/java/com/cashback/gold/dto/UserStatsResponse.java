package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsResponse {
    private long totalUsers;
    private long partners;
    private long b2bVendors;
}
