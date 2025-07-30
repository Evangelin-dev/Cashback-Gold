package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class GoldPlantEnrollmentResponse {
    private Long enrollmentId;
    private String planName;
    private LocalDate startDate;
    private String status;
    private BigDecimal investedAmount;
    private BigDecimal goldAccumulated;
    private boolean lockinCompleted;
    private boolean recalled;
}


