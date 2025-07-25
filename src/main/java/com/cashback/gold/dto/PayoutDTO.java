package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PayoutDTO {
    private Long id;
    private Double amount;
    private String method;
    private String methodDetail;
    private String status;
    private LocalDateTime requestedAt;
    private String partnerName;
    private String partnerRole;
}

