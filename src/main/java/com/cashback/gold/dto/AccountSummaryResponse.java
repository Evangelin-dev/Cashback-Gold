package com.cashback.gold.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccountSummaryResponse {
    private long totalUsers;
    private long partners;

    private double goldSoldGrams;       // raw number (for calculations)
    private String goldSoldDisplay;     // e.g., "3.2kg"

    private long commissionEarnedInr;   // raw number (for calculations)
    private String commissionEarnedDisplay; // e.g., "₹1,20,000"

    private long b2bVendors;
}
