package com.cashback.gold.dto;

import lombok.Data;

@Data
public class SavingPlanRequest {
    private String name;
    private String duration;
    private String amount;
    private String description;
    private String status; // "ACTIVE" or "CLOSED"
}

