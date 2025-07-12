package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class WalletBalanceResponse {
    private BigDecimal balance;
    private BigDecimal creditLimit;
    private BigDecimal usedCredit;
    private LocalDateTime lastUpdated;
}
