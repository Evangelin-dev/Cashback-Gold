package com.cashback.gold.dto;

import lombok.Data;

@Data
public class SavingPlanRecallRequest {
    private Long enrollmentId;
    private String action; // "BUY_JEWEL" or "SELL_GOLD"
}
