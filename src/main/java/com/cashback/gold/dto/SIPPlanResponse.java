package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SIPPlanResponse {
    private Long id;
    private String name;
    private String tenure;
    private String monthlyAmount;
    private String description;
    private String status;
}
