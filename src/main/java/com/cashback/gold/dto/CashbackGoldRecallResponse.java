package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashbackGoldRecallResponse {
    private Long enrollmentId;
    private String userName;
    private String userEmail;
    private String schemeName;
    private BigDecimal totalAmountPaid;
    private BigDecimal goldAccumulated;
    private String recallType;
    private BigDecimal recallFinalAmount;
    private String status;
}
