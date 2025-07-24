package com.cashback.gold.controller;

import com.cashback.gold.dto.PayoutRequestDto;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.entity.PayoutRequest;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.PartnerCommissionService;
import com.cashback.gold.service.PayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partner")
@RequiredArgsConstructor
public class PartnerCommissionController {

    private final PartnerCommissionService partnerCommissionService;
    private final PayoutService payoutService;

    @GetMapping("/commissions")
    public ResponseEntity<?> getCommissions(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(partnerCommissionService.getMyEarnings(user.getId()));
    }

    @GetMapping("/earnings")
    public ResponseEntity<Map<String, Object>> getPartnerEarnings(@AuthenticationPrincipal UserPrincipal user) {
        Map<String, Object> earnings = partnerCommissionService.getApprovedEarnings(user.getId());
        return ResponseEntity.ok(earnings);
    }

    @PostMapping("/request-payout")
    public ResponseEntity<ApiResponse> requestPayout(
            @RequestBody PayoutRequestDto dto,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        payoutService.requestPayout(user.getId(), dto);
        return ResponseEntity.ok(new ApiResponse(true, "Payout request submitted"));
    }

    @GetMapping("/payout-history")
    public ResponseEntity<List<PayoutRequest>> getPayoutHistory(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(payoutService.getPartnerPayoutHistory(user.getId()));
    }
}

