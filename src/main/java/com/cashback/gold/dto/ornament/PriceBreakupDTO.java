package com.cashback.gold.dto.ornament;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PriceBreakupDTO {
    private Long id; // Optional, for updates
    private String component;
    private Double goldRate18kt;
    private Double weightG;
    private Double discount;
    private Double finalValue;
}