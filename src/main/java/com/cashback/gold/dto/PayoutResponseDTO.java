package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PayoutResponseDTO {
    private Long id;
    private Long partnerId;
    private String partnerName;
    private String partnerRole;
    private Double amount;
    private String method;
    private String methodDetail;
    private String status;
    private LocalDateTime requestedAt;
}
