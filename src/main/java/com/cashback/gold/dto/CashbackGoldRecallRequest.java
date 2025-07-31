package com.cashback.gold.dto;

import lombok.Data;

@Data
public class CashbackGoldRecallRequest {
    private Long enrollmentId;
    private String recallType; // "SELL" or "COIN"
}

