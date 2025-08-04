package com.cashback.gold.dto.ornament;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PriceBreakupDTO {
    private Long id;
    private String component;
    private Double netWeight;
    private Double grossWeight;
    private Double discount;
    private Double finalValue;
}
