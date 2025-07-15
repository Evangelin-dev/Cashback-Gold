package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InventoryResponse {
    private Double totalStock;
    private Double inStoreStock;
    private Double goldStock;
    private Double silverStock;
    private Double diamondStock;
    private String unit;
    private LocalDateTime updatedAt;
}

