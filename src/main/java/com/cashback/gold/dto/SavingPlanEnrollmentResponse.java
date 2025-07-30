package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class SavingPlanEnrollmentResponse {
    private Long enrollmentId;
    private String planName;
    private LocalDate startDate;
    private String status;

    private Double totalAmountPaid;
    private Double totalGoldAccumulated;
    private Double totalBonus;

    private List<SavingPlanPaymentInfo> payments;
}
