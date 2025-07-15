package com.cashback.gold.controller;

import com.cashback.gold.dto.InventoryRequest;
import com.cashback.gold.dto.InventoryResponse;
import com.cashback.gold.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<InventoryResponse> getInventory() {
        return ResponseEntity.ok(inventoryService.getInventory());
    }

    @PutMapping
    public ResponseEntity<InventoryResponse> updateInventory(@RequestBody InventoryRequest request) {
        return ResponseEntity.ok(inventoryService.updateInventory(request));
    }
}

