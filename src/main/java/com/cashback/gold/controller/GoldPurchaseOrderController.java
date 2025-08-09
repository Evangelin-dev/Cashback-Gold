package com.cashback.gold.controller;

import com.cashback.gold.dto.GoldPurchaseRequest;
import com.cashback.gold.dto.GoldStatusUpdateRequest;
import com.cashback.gold.dto.OrderResponse;
import com.cashback.gold.entity.GoldPurchaseOrder;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.GoldPurchaseOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gold")
@RequiredArgsConstructor
@Tag(name = "Gold Purchase Order Controller", description = "Manage gold purchase orders (Deprecated)")
@Deprecated
public class GoldPurchaseOrderController {

    private final GoldPurchaseOrderService service;

    @Operation(summary = "Create a new gold purchase order (User)", deprecated = true)
    @PostMapping("/purchase")
    public ResponseEntity<GoldPurchaseOrder> purchaseGold(
            @RequestBody GoldPurchaseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(service.createOrder(userPrincipal, request));
    }

    @Operation(summary = "Get all gold purchase orders (Admin)", deprecated = true)
    @GetMapping("/admin/all")
    public ResponseEntity<List<GoldPurchaseOrder>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    @Operation(summary = "Get logged-in user's gold purchase orders (User)", deprecated = true)
    @GetMapping("/user")
    public ResponseEntity<List<GoldPurchaseOrder>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(service.getUserOrders(userPrincipal.getId()));
    }

    @Operation(summary = "Update status of a gold purchase order (Admin)", deprecated = true)
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<GoldPurchaseOrder> updateStatus(
            @PathVariable Long id,
            @RequestBody GoldStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus()));
    }

    @Operation(summary = "Get current gold rate", deprecated = true)
    @GetMapping("/rate")
    public ResponseEntity<Map<String, Double>> getGoldRate() {
        return ResponseEntity.ok(Map.of("ratePerGram", service.getCurrentGoldRate()));
    }

    @Operation(summary = "Get my gold purchase orders", deprecated = true)
    @GetMapping("/orders/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        List<OrderResponse> orders = service.getOrdersByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }
}
