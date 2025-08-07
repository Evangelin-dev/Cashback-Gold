package com.cashback.gold.dto.ornament;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;




@Data
public class OrnamentRequest {
    private String name;
    private BigDecimal goldPerGramPrice;
    private String category;
    private String subCategory;
    private String itemType;
    private String details;
    private String description, description1, description2, description3;
    private String material;
    private String purity;
    private String quality;
    private String warranty;
    private String origin;
    private BigDecimal makingChargePercent;
    private BigDecimal discount;

    private List<PriceBreakupDTO> priceBreakups;
}

