package com.cashback.gold.dto;

import lombok.Data;

@Data
public class GoldStatusUpdateRequest {
    private String status; // pending | processing | completed | cancelled
}

