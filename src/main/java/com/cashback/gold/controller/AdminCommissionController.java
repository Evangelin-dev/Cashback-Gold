//for feature use
package com.cashback.gold.controller;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.PartnerCommissionService;
import com.cashback.gold.service.PayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/commissions")
@RequiredArgsConstructor
public class AdminCommissionController {

    private final PartnerCommissionService commissionService;
    private final PayoutService payoutService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCommissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String type // "partner", "b2b", or "all"
    ) {
        return ResponseEntity.ok(commissionService.getCommissionsForAdmin(page, size, type));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCommissionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        commissionService.updateCommissionStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    @GetMapping("/payouts")
    public ResponseEntity<Map<String, Object>> getAllPayouts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String userType // Optional filter: USER, PARTNER, B2B
    ) {
        return ResponseEntity.ok(payoutService.getAllPayouts(page, size, userType));
    }

    @PutMapping("/payouts/{id}/status")
    public ResponseEntity<ApiResponse> updatePayoutStatus(
            @PathVariable Long id,
            @RequestParam String status // values: Paid, Rejected
    ) {
        payoutService.updatePayoutStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Status updated to " + status));
    }


}

