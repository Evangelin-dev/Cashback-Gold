package com.cashback.gold.controller;

import com.cashback.gold.dto.OrderRequest;
import com.cashback.gold.entity.OrderHistory;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.OrderHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderHistoryController {

    private final OrderHistoryService orderHistoryService;

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        OrderHistory saved = orderHistoryService.createOrderFromUser(request, userPrincipal);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String customerType,
            @RequestParam(required = false) String planType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return ResponseEntity.ok(orderHistoryService.getAllOrdersWithFilters(
                page, size, customerType, planType, status, keyword, startDate, endDate
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderHistory> getOrderById(@PathVariable Long id) {
        return orderHistoryService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
