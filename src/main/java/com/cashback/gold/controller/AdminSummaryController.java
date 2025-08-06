package com.cashback.gold.controller;

import com.cashback.gold.dto.AccountSummaryResponse;
import com.cashback.gold.service.AdminSummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/account-summary")
public class AdminSummaryController {

    private final AdminSummaryService service;

    @GetMapping
    public ResponseEntity<AccountSummaryResponse> getAccountSummary() {
        return ResponseEntity.ok(service.getSummary());
    }
}
