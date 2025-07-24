package com.cashback.gold.dto;

import lombok.Data;

@Data
public class PayoutRequestDto {
    private Double amount;
    private String method;
    private String methodDetail;
}

