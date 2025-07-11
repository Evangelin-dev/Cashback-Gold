package com.cashback.gold.controller;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.dto.kyc.KycUploadRequest;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.UserKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kyc/user")
@RequiredArgsConstructor
public class UserKycController {

    private final UserKycService userKycService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<KycResponse> uploadKyc(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestPart(name = "aadharOrGst", required = true) MultipartFile aadhar,
            @RequestPart(name = "pan", required = true) MultipartFile pan
    ) {
        KycUploadRequest request = new KycUploadRequest();
        request.setAadharOrGst(aadhar);
        request.setPan(pan);
        return ResponseEntity.ok(userKycService.uploadKyc(userPrincipal.getId(), request));
    }

    @GetMapping
    public ResponseEntity<KycResponse> getKyc(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(userKycService.getKyc(userPrincipal.getId()));
    }
}