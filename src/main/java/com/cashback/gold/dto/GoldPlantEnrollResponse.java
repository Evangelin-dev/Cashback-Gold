package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class GoldPlantEnrollResponse {
    private Long enrollmentId;
    private String schemeName;
    private BigDecimal amountInvested;
    private LocalDate startDate;
    private String status;
}
