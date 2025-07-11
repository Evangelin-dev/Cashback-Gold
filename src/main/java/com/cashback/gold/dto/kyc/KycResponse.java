package com.cashback.gold.dto.kyc;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KycResponse {
    private Long id;
    private Long userId;
    private String userType;
    private String aadharUrl;
    private String panUrl;
    private String gstCertificateUrl;
    private String panCardUrl;
    private String addressProofUrl;
    private String bankStatementUrl;
    private String status;
    private String submittedAt; // Added for frontend
}