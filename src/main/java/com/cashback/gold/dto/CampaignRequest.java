package com.cashback.gold.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CampaignRequest {
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String multiplier;
    private String status;
}
