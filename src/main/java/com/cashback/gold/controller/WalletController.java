package com.cashback.gold.controller;

import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.dto.WalletBalanceResponse;
import com.cashback.gold.dto.WalletTopupRequest;
import com.cashback.gold.dto.WalletTransactionResponse;
import com.cashback.gold.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance() {
        return ResponseEntity.ok(walletService.getWalletBalance());
    }

    @PostMapping("/topup")
    public ResponseEntity<ApiResponse> topupWallet(@RequestBody WalletTopupRequest request) {
        return ResponseEntity.ok(walletService.topupWallet(request));
    }

    @GetMapping("/transactions")
    public ResponseEntity<Page<WalletTransactionResponse>> getTransactionHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(walletService.getTransactionHistory(pageable));
    }

    @PostMapping("/credit-limit/request")
    public ResponseEntity<ApiResponse> requestCreditLimitIncrease() {
        return ResponseEntity.ok(walletService.requestCreditLimitIncrease());
    }
}