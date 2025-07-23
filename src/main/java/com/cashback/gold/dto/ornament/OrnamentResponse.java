package com.cashback.gold.dto.ornament;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OrnamentResponse {
    private Long id;
    private String name;
    private Double price;
    private String category;
    private String subCategory;
    private String gender;
    private String description1;
    private String description2;
    private String description3;
    private String description;
    private String mainImage;
    private List<String> subImages;
    private String material;
    private String purity;
    private String quality;
    private String warranty; // Added warranty field
    private String details;
    private List<PriceBreakupDTO> priceBreakups;
}