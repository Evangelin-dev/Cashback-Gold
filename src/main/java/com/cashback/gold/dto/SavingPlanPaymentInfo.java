package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class SavingPlanPaymentInfo {
    private Integer month;
    private LocalDate paymentDate;
    private Double amountPaid;
    private Double goldGrams;
    private Double bonusApplied;
    private Boolean onTime;
}
