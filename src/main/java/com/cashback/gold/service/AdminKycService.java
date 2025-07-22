package com.cashback.gold.service;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.entity.KycDocument;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.KycRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AdminKycService {

    private final KycRepository kycRepo;

    public Page<KycResponse> getAllKyc(String userType, int page, int size) {
        if (!userType.matches("USER|PARTNER|B2B")) {
            throw new InvalidArgumentException("Invalid user type: " + userType);
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        Page<KycDocument> pagedDocs = kycRepo.findByUserType(userType, pageable);
        return pagedDocs.map(this::toKycResponse);
    }

    public KycResponse updateStatus(Long id, String status) {
        if (!status.matches("PENDING|APPROVED|REJECTED")) {
            throw new InvalidArgumentException("Status must be PENDING, APPROVED, or REJECTED");
        }
        KycDocument doc = kycRepo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("KYC document not found"));
        doc.setStatus(status);
        kycRepo.save(doc);
        return toKycResponse(doc);
    }

    private KycResponse toKycResponse(KycDocument doc) {
        return KycResponse.builder()
                .id(doc.getId())
                .userId(doc.getUserId())
                .userType(doc.getUserType())
                .aadharUrl(doc.getAadharUrl())
                .panCardUrl(doc.getPanCardUrl())
                .gstCertificateUrl(doc.getGstCertificateUrl())
                .panCardUrl(doc.getPanCardUrl())
                .addressProofUrl(doc.getAddressProofUrl())
                .bankStatementUrl(doc.getBankStatementUrl())
                .status(doc.getStatus())
                .submittedAt(doc.getSubmittedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }
}