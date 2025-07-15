package com.cashback.gold.controller;

import com.cashback.gold.dto.MetalRatesResponse;
import com.cashback.gold.service.GoldPurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metal-rates")
@RequiredArgsConstructor
public class MetalRateController {

    private final GoldPurchaseOrderService goldPurchaseOrderService;

    @GetMapping
    public ResponseEntity<MetalRatesResponse> refreshGoldAndSilverRates() {
        return ResponseEntity.ok(goldPurchaseOrderService.fetchGoldAndSilverRatesFromApi());
    }

}
