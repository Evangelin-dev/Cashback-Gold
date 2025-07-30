package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SavingPlanRecallResponse {
    private String action; // BUY_JEWEL or SELL_GOLD
    private Double accumulatedGoldGrams;
    private Double accumulatedAmount;
    private Double serviceCharge; // if SELL
    private Double finalReturnAmount;
    private String redirectTo; // optional (BUY_JEWEL = /buy-ornaments)
}
