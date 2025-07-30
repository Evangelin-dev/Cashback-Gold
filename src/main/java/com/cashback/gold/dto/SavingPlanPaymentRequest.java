package com.cashback.gold.dto;

import lombok.Data;

@Data
public class SavingPlanPaymentRequest {
    private Long enrollmentId;
    private Double amountPaid;
}
