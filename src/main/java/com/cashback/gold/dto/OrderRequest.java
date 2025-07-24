package com.cashback.gold.dto;

import lombok.Data;

@Data
public class OrderRequest {
    private String planType;       // CHIT, SIP, GOLD_PLANT
    private String planName;
    private String duration;
    private Double amount;
    private String paymentMethod;  // Razorpay, UPI, etc.
}
