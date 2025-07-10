package com.cashback.gold.dto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminProfileResponse {
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private String avatarUrl;
}

