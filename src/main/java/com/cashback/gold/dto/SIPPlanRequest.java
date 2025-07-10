package com.cashback.gold.dto;

import lombok.Data;

@Data
public class SIPPlanRequest {
    private String name;
    private String tenure;
    private String monthlyAmount;
    private String description;
    private String status;
}
