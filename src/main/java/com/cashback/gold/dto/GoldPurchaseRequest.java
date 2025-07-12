package com.cashback.gold.dto;

import lombok.Data;

@Data
public class GoldPurchaseRequest {
    private double quantity;
    private String deliveryMethod;
    private String paymentMethod;
}

