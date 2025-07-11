package com.cashback.gold.dto.kyc;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class KycUploadRequest {
    private MultipartFile aadharOrGst;
    private MultipartFile pan;
    private MultipartFile addressProof;
    private MultipartFile bankStatement;
}