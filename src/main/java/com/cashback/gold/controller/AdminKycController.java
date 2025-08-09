package com.cashback.gold.controller;

import com.cashback.gold.dto.kyc.KycResponse;
import com.cashback.gold.service.AdminKycService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kyc/admin")
@RequiredArgsConstructor
@Tag(name = "Admin KYC Controller", description = "Admin APIs to manage KYC verification")
public class AdminKycController {

    private final AdminKycService adminKycService;

    @Operation(summary = "Get all KYC requests for a user type")
    @ApiResponse(responseCode = "200", description = "KYC list fetched successfully")
    @GetMapping
    public ResponseEntity<Page<KycResponse>> getAllKyc(
            @Parameter(description = "User type filter (USER, PARTNER, B2B)") @RequestParam String userType,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(adminKycService.getAllKyc(userType, page, size));
    }

    @Operation(summary = "Update KYC status by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "KYC status updated"),
            @ApiResponse(responseCode = "404", description = "KYC record not found")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<KycResponse> updateStatus(
            @Parameter(description = "KYC record ID") @PathVariable Long id,
            @Parameter(description = "New KYC status (APPROVED, REJECTED)") @RequestParam String status
    ) {
        return ResponseEntity.ok(adminKycService.updateStatus(id, status));
    }
}
