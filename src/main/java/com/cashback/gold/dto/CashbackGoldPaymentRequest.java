package com.cashback.gold.dto;

import lombok.Data;

@Data
public class CashbackGoldPaymentRequest {
    private Long enrollmentId;
    private Double amountPaid;
}

