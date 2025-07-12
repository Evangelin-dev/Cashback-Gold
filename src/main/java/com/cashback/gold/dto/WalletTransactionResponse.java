package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WalletTransactionResponse {
    private Long id;
    private String date;
    private String type;
    private String amount;
    private String status;
    private String color;
}
