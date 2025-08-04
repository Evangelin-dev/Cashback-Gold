package com.cashback.gold.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GoldPlantEnrollmentCallbackRequest {

    private Long schemeId;
    private BigDecimal amountInvested;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
