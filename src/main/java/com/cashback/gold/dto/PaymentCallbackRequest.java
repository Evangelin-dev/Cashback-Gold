package com.cashback.gold.dto;

import lombok.Data;

@Data
public class PaymentCallbackRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private Long enrollmentId;
    private Double amountPaid;
}
