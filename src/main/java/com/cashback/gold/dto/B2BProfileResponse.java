package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class B2BProfileResponse {
    private Long id;
    private Long userId;
    private String companyName;
    private String gstin;
    private String pan;
    private String address;
    private String bankAccount;
    private String upi;
    private String teamEmail;
    private String status;
    private String createdAt;
    private String updatedAt;
}