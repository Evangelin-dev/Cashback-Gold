package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CampaignResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String multiplier;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
