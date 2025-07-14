package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketingResourceRequest {
    private String title;
    private String description;
    private String status;
}
