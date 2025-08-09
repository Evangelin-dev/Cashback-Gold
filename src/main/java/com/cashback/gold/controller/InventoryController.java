package com.cashback.gold.controller;

import com.cashback.gold.dto.InventoryRequest;
import com.cashback.gold.dto.InventoryResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.InventoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Tag(name = "Admin Inventory Controller", description = "Manage gold/silver inventory by Admin")
public class InventoryController {

    private final InventoryService inventoryService;

    @Operation(summary = "Get current inventory")
    @ApiResponse(responseCode = "200", description = "Inventory fetched successfully")
    @GetMapping
    public ResponseEntity<InventoryResponse> getInventory(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(inventoryService.getInventory(currentUser));
    }

    @Operation(summary = "Update inventory")
    @ApiResponse(responseCode = "200", description = "Inventory updated successfully")
    @PutMapping
    public ResponseEntity<InventoryResponse> updateInventory(
            @RequestBody InventoryRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return ResponseEntity.ok(inventoryService.updateInventory(request, currentUser));
    }
}
