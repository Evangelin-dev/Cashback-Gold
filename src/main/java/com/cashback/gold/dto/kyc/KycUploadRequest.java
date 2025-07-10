package com.cashback.gold.dto.kyc;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KycUploadRequest {
    private MultipartFile doc1; // Aadhaar / GST / Agreement
    private MultipartFile doc2; // PAN
}
