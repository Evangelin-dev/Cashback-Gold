package com.cashback.gold.controller;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.dto.kyc.KycUploadRequest;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.B2BKycService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc/b2b")
@RequiredArgsConstructor
@Tag(name = "B2B KYC Controller", description = "B2B KYC APIs (Deprecated)")
@Deprecated
public class B2BKycController {

    private final B2BKycService b2bKycService;

    @Operation(summary = "Upload B2B KYC documents", deprecated = true)
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

    @Operation(summary = "Get B2B KYC details", deprecated = true)
    @GetMapping("/kyc")
    public ResponseEntity<KycResponse> getKyc(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(b2bKycService.getKyc(userPrincipal.getId()));
    }
}
