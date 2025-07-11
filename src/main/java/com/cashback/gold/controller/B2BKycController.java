package com.cashback.gold.controller;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.dto.kyc.KycUploadRequest;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.B2BKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc/b2b")
@RequiredArgsConstructor
public class B2BKycController {

    private final B2BKycService b2bKycService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<KycResponse> uploadKyc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart(name = "aadharOrGst", required = true) MultipartFile aadharOrGst,
            @RequestPart(name = "pan", required = true) MultipartFile pan,
            @RequestPart(name = "addressProof", required = true) MultipartFile addressProof,
            @RequestPart(name = "bankStatement", required = true) MultipartFile bankStatement
    ) {
        KycUploadRequest request = new KycUploadRequest();
        request.setAadharOrGst(aadharOrGst);
        request.setPan(pan);
        request.setAddressProof(addressProof);
        request.setBankStatement(bankStatement);
        return ResponseEntity.ok(b2bKycService.uploadKyc(userPrincipal.getId(), request));
    }

    @GetMapping("/kyc")
    public ResponseEntity<KycResponse> getKyc(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(b2bKycService.getKyc(userPrincipal.getId()));
    }
}