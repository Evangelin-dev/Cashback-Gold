package com.cashback.gold.controller;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.service.AdminKycService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kyc/admin")
@RequiredArgsConstructor
public class AdminKycController {

    private final AdminKycService adminKycService;

    @GetMapping
    public ResponseEntity<Page<KycResponse>> getAllKyc(
            @RequestParam String userType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminKycService.getAllKyc(userType, page, size));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<KycResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(adminKycService.updateStatus(id, status));
    }
}