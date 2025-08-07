package com.cashback.gold.dto;

import lombok.Data;

@Data
public class OrnamentCheckoutRequest {
    private String fullName;
    private String mobile;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
}

