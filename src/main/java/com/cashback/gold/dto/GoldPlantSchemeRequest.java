package com.cashback.gold.dto;

import lombok.Data;

@Data
public class GoldPlantSchemeRequest {
    private String name;
    private String duration;
    private String minInvest;
    private String status;
    private String description;
}

