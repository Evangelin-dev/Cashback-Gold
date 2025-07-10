package com.cashback.gold.controller;
import com.cashback.gold.dto.auth.*;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.dto.kyc.KycUploadRequest;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.KycService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc")
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<KycResponse> uploadKyc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart("doc1") MultipartFile doc1,
            @RequestPart("doc2") MultipartFile doc2
    ) {
        Long userId = userPrincipal.getId();
        String role = userPrincipal.getRole();

        KycUploadRequest request = new KycUploadRequest();
        request.setDoc1(doc1);
        request.setDoc2(doc2);

        KycResponse response = kycService.uploadKyc(userId, role, request);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<Page<KycResponse>> getByType(
            @RequestParam String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(kycService.getAllByType(type, page, size));
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<KycResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(kycService.updateStatus(id, status));
    }
}

