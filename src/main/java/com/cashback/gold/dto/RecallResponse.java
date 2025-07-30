package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecallResponse {
    private Long enrollmentId;
    private String recallStatus;
    private double refundAmount;
    private boolean penaltyApplied;
    private String message;
}
