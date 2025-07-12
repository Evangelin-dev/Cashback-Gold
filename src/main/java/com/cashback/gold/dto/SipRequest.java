package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SipRequest {
    private String name;
    private String gender;
    private String dob;
    private String email;
    private String mobile;
    private String countryCode;
    private String city;
    private String town;
    private String state;
    private String country;
    private String password;
    private String startDate;
    private Double amount;
    private Integer duration;
    private String plan;
    private String planName;
}