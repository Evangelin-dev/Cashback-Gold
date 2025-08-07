package com.cashback.gold.dto.ornament;
import lombok.Data;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceBreakupDTO {
    private String component;
    private BigDecimal netWeight;
    private BigDecimal value;
}
