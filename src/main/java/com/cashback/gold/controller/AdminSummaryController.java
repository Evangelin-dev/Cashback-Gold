package com.cashback.gold.controller;

import com.cashback.gold.dto.AccountSummaryResponse;
import com.cashback.gold.service.AdminSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account-summary")
@Tag(name = "Admin Summary Controller", description = "Provides account summary information for admin dashboard")
public class AdminSummaryController {

    private final AdminSummaryService service;

    @Operation(summary = "Get account summary")
    @ApiResponse(responseCode = "200", description = "Account summary fetched successfully")
    @GetMapping
    public ResponseEntity<AccountSummaryResponse> getAccountSummary() {
        return ResponseEntity.ok(service.getSummary());
    }
}
