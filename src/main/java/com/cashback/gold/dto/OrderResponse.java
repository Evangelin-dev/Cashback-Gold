package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
    private String id;
    private String date;
    private String quantity;
    private String total;
    private String status;
    private String invoice;
}

