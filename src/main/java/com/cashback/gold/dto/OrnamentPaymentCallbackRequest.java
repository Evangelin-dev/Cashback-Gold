package com.cashback.gold.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrnamentPaymentCallbackRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private BigDecimal amount;
}
