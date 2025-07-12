package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class WalletTopupRequest {
    private BigDecimal amount;
    private String paymentMethod;
}
