package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoldPlantRecallAdminRow {
    private Long enrollmentId;
    private String userName;
    private String userEmail;
    private String schemeName;
    private BigDecimal amountInvested;
    private BigDecimal refundAmount;
    private Boolean penalty;
    private LocalDateTime recallAt;
    private String status; // RECALLED
}

