package com.cashback.gold.dto;

import lombok.Data;

@Data
public class B2BProfileRequest {
    private String companyName;
    private String gstin;
    private String pan;
    private String address;
    private String bankAccount;
    private String upi;
    private String teamEmail;
}