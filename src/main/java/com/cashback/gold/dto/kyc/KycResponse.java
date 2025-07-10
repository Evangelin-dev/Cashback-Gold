package com.cashback.gold.dto.kyc;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KycResponse {
    private Long id;
    private Long userId;
    private String type; // User, B2B, Partner
    private String doc1Url;
    private String doc2Url;
    private String status;
}
