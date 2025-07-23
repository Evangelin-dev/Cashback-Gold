package com.cashback.gold.controller;

import com.cashback.gold.dto.GoldPurchaseRequest;
import com.cashback.gold.dto.GoldStatusUpdateRequest;
import com.cashback.gold.dto.OrderResponse;
import com.cashback.gold.entity.GoldPurchaseOrder;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.GoldPurchaseOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gold")
@RequiredArgsConstructor
public class GoldPurchaseOrderController {

    private final GoldPurchaseOrderService service;

    // User creates a new purchase order
    @PostMapping("/purchase")
    public ResponseEntity<GoldPurchaseOrder> purchaseGold(
            @RequestBody GoldPurchaseRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
            ) {
        return ResponseEntity.ok(service.createOrder(userPrincipal, request));
    }

    // Admin views all orders
    @GetMapping("/admin/all")
    public ResponseEntity<List<GoldPurchaseOrder>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    // Admin views purchase/payment history (new endpoint)
    @GetMapping("/admin/orders/history")
    public ResponseEntity<List<GoldPurchaseOrder>> getAdminOrderHistory() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    // User views their own orders
    @GetMapping("/user")
    public ResponseEntity<List<GoldPurchaseOrder>> getUserOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.getUserOrders(userPrincipal.getId()));
    }

    // Admin changes status of an order
    @PutMapping("/admin/{id}/status")
    public ResponseEntity<GoldPurchaseOrder> updateStatus(
            @PathVariable Long id,
            @RequestBody GoldStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(service.updateStatus(id, request.getStatus()));
    }

    // Get current gold rate
    @GetMapping("/rate")
    public ResponseEntity<Map<String, Double>> getGoldRate() {
        return ResponseEntity.ok(Map.of("ratePerGram", service.getCurrentGoldRate()));
    }

    @GetMapping("/orders/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserPrincipal user) {
        List<OrderResponse> orders = service.getOrdersByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }

}

