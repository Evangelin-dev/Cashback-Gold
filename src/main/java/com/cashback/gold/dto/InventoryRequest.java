package com.cashback.gold.dto;

import lombok.Data;

@Data
public class InventoryRequest {
    private Double totalStock;
    private Double inStoreStock;
    private Double goldStock;
    private Double silverStock;
    private Double diamondStock;
    private String unit;
}

