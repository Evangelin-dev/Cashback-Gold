package com.cashback.gold.dto.ornament;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

//@Data
//public class OrnamentRequest {
//    private String name;
//    private Double totalGram;
//    private Double gramPrice;
//    private Double totalPrice;
//    private String category;
//    private String subCategory;
//    private String gender;
//    private String itemType;
//    private String description;
//    private String description1;
//    private String description2;
//    private String description3;
//    private String material;
//    private String purity;
//    private String quality;
//    private String warranty;
//    private String details;
//    private String origin;
//    private Double makingChargePercent;
//    private List<PriceBreakupDTO> priceBreakups;
//}


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

