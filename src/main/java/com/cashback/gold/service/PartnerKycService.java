package com.cashback.gold.service;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.dto.kyc.KycUploadRequest;
import com.cashback.gold.entity.KycDocument;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.KycRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class PartnerKycService {

    private final KycRepository kycRepo;
    private final UserRepository userRepo;
    private final S3Service s3Service;

    public KycResponse uploadKyc(Long userId, KycUploadRequest request) {
        // Validate user
        validateUser(userId, "PARTNER");

        // Validate documents
        if (request.getAadharOrGst() == null || request.getPan() == null) {
            throw new InvalidArgumentException("Aadhaar and PAN are required for PARTNER");
        }
        if (request.getAddressProof() != null || request.getBankStatement() != null) {
            throw new InvalidArgumentException("Address proof and bank statement are not allowed for PARTNER");
        }

        // Upload files
        String aadharUrl = s3Service.uploadFile(request.getAadharOrGst());
        String panUrl = s3Service.uploadFile(request.getPan());

        KycDocument doc = KycDocument.builder()
                .userId(userId)
                .userType("PARTNER")
                .aadharUrl(aadharUrl)
                .panUrl(panUrl)
                .status("PENDING")
                .submittedAt(LocalDateTime.now())
                .build();

        kycRepo.save(doc);
        return toKycResponse(doc);
    }

    public KycResponse getKyc(Long userId) {
        validateUser(userId, "PARTNER");
        KycDocument doc = kycRepo.findTopByUserIdAndUserTypeOrderBySubmittedAtDesc(userId, "PARTNER")
                .orElseThrow(() -> new InvalidArgumentException("No KYC documents found for PARTNER"));
        return toKycResponse(doc);
    }

    private void validateUser(Long userId, String expectedRole) {
        userRepo.findById(userId)
                .filter(user -> expectedRole.equals(user.getRole()))
                .orElseThrow(() -> new InvalidArgumentException("Invalid user or role"));
    }

    private KycResponse toKycResponse(KycDocument doc) {
        return KycResponse.builder()
                .id(doc.getId())
                .userId(doc.getUserId())
                .userType(doc.getUserType())
                .aadharUrl(doc.getAadharUrl())
                .panUrl(doc.getPanUrl())
                .gstCertificateUrl(doc.getGstCertificateUrl())
                .panCardUrl(doc.getPanCardUrl())
                .addressProofUrl(doc.getAddressProofUrl())
                .bankStatementUrl(doc.getBankStatementUrl())
                .status(doc.getStatus())
                .submittedAt(doc.getSubmittedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }
}