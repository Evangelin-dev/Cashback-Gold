package com.cashback.gold.service;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.dto.kyc.KycUploadRequest;
import com.cashback.gold.entity.KycDocument;
import com.cashback.gold.repository.KycRepository;
import com.cashback.gold.service.aws.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class KycService {

    private final KycRepository kycRepo;
    private final S3Service s3Service;

    public KycResponse uploadKyc(Long userId, String role, KycUploadRequest req) {
        String doc1Url = s3Service.uploadFile(req.getDoc1());
        String doc2Url = s3Service.uploadFile(req.getDoc2());

        KycDocument doc = KycDocument.builder()
                .userId(userId)
                .type(role) // use role to set type
                .doc1Url(doc1Url)
                .doc2Url(doc2Url)
                .status("PENDING")
                .submittedAt(LocalDateTime.now())
                .build();

        return toResponse(kycRepo.save(doc));
    }


    public Page<KycResponse> getAllByType(String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submittedAt"));
        Page<KycDocument> pagedDocs = kycRepo.findByType(type, pageable);
        return pagedDocs.map(this::toResponse);
    }


    public KycResponse updateStatus(Long id, String status) {
        KycDocument doc = kycRepo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        doc.setStatus(status);
        return toResponse(kycRepo.save(doc));
    }

    private KycResponse toResponse(KycDocument d) {
        return KycResponse.builder()
                .id(d.getId())
                .userId(d.getUserId())
                .type(d.getType())
                .doc1Url(d.getDoc1Url())
                .doc2Url(d.getDoc2Url())
                .status(d.getStatus())
                .build();
    }
}

