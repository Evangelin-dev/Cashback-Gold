package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SavingPlanResponse {
    private Long id;
    private String name;
    private String duration;
    private String amount;
    private String description;
    private String status;
    private String keyPoint1;
    private String keyPoint2;
    private String keyPoint3;
}
