package com.cashback.gold.dto;

import lombok.Data;

@Data
public class CashbackGoldPaymentCallbackRequest {
    private Long enrollmentId;
    private double amountPaid;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}

