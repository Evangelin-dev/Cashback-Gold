package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavingPlanTerminationAdminRow {
    private Long enrollmentId;
    private String userName;
    private String userEmail;
    private String planName;
    private Double accumulatedAmount;
    private Double accumulatedGoldGrams;
    private Double serviceCharge;
    private Double finalAmount;
    private String status;         // TERMINATED
    private LocalDateTime recallAt;
    private String recallAction;   // SELL_GOLD
}

