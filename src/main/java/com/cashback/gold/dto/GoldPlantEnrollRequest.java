package com.cashback.gold.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GoldPlantEnrollRequest {
    private Long schemeId;
    private BigDecimal amountInvested;
}
