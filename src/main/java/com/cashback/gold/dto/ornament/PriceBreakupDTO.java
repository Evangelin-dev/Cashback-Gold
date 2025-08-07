package com.cashback.gold.dto.ornament;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

//@Data
//@Builder
//public class PriceBreakupDTO {
//    private Long id;
//    private String component;
//    private Double netWeight;
//    private Double grossWeight;
//    private Double discount;
//    private Double finalValue;
//}


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceBreakupDTO {
    private String component;
    private BigDecimal netWeight;
    private BigDecimal value;
}
