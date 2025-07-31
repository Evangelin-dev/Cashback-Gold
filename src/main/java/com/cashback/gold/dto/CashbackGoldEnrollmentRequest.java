package com.cashback.gold.dto;

import lombok.Data;

@Data
public class CashbackGoldEnrollmentRequest {
    private Long schemeId;
    private Double initialAmountPaid; // optional first payment
}

