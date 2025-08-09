package com.cashback.gold.controller;

import com.cashback.gold.dto.MetalRatesResponse;
import com.cashback.gold.service.GoldPurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metal-rates")
@RequiredArgsConstructor
@Tag(name = "Metal Rate Controller", description = "Public API to fetch live gold and silver rates")
public class MetalRateController {

    private final GoldPurchaseOrderService goldPurchaseOrderService;

    @Operation(summary = "Get live gold and silver rates (Public)")
    @ApiResponse(responseCode = "200", description = "Rates fetched successfully")
    @GetMapping
    public ResponseEntity<MetalRatesResponse> refreshGoldAndSilverRates() {
        return ResponseEntity.ok(goldPurchaseOrderService.fetchGoldAndSilverRatesFromApi());
    }
}
