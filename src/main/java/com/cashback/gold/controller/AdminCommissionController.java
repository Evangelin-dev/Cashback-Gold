//for feature use
package com.cashback.gold.controller;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.PartnerCommissionService;
import com.cashback.gold.service.PayoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/commissions")
@RequiredArgsConstructor
@Tag(name = "Admin Commission Controller", description = "Admin view to manage commissions and payouts")
public class AdminCommissionController {

    private final PartnerCommissionService commissionService;
    private final PayoutService payoutService;

    @Operation(summary = "Get all commissions (admin)")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Commissions fetched")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCommissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String type // "partner", "b2b", or "all"
    ) {
        return ResponseEntity.ok(commissionService.getCommissionsForAdmin(page, size, type));
    }

    @Operation(summary = "Update commission status by ID (admin)")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Commission not found")
    })
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateCommissionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        commissionService.updateCommissionStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }

    @Operation(summary = "Get all payout requests (admin)")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payouts fetched")
    @GetMapping("/payouts")
    public ResponseEntity<Map<String, Object>> getAllPayouts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String userType // Optional filter: USER, PARTNER, B2B
    ) {
        return ResponseEntity.ok(payoutService.getAllPayouts(page, size, userType));
    }

    @Operation(summary = "Update payout status by ID (admin)")
    @io.swagger.v3.oas.annotations.responses.ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payout status updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Payout not found")
    })
    @PutMapping("/payouts/{id}/status")
    public ResponseEntity<ApiResponse> updatePayoutStatus(
            @PathVariable Long id,
            @RequestParam String status // values: Paid, Rejected
    ) {
        payoutService.updatePayoutStatus(id, status);
        return ResponseEntity.ok(new ApiResponse(true, "Status updated to " + status));
    }


}

