//package com.cashback.gold.controller;
//
//import com.cashback.gold.dto.OrderRequest;
//import com.cashback.gold.entity.OrderHistory;
//import com.cashback.gold.security.UserPrincipal;
//import com.cashback.gold.service.OrderHistoryService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/orders")
//@RequiredArgsConstructor
//public class OrderHistoryController {
//
//    private final OrderHistoryService orderHistoryService;
//
//    @PostMapping
//    public ResponseEntity<?> createOrder(
//            @RequestBody OrderRequest request,
//            @AuthenticationPrincipal UserPrincipal userPrincipal
//    ) {
//        OrderHistory saved = orderHistoryService.createOrderFromUser(request, userPrincipal);
//        return ResponseEntity.ok(saved);
//    }
//
//    @PostMapping("/checkout-cart")
//    public ResponseEntity<?> checkoutOrnamentCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        OrderHistory order = orderHistoryService.createOrnamentOrderFromCart(userPrincipal);
//        return ResponseEntity.ok(order);
//    }
//
//    @GetMapping
//    public ResponseEntity<Map<String, Object>> getAllOrders(
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(required = false) String customerType,
//            @RequestParam(required = false) String planType,
//            @RequestParam(required = false) String status,
//            @RequestParam(required = false) String keyword,
//            @RequestParam(required = false) String startDate,
//            @RequestParam(required = false) String endDate
//    ) {
//        return ResponseEntity.ok(orderHistoryService.getAllOrdersWithFilters(
//                page, size, customerType, planType, status, keyword, startDate, endDate
//        ));
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<OrderHistory> getOrderById(@PathVariable Long id) {
//        return orderHistoryService.getOrderById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping("/my")
//    public ResponseEntity<List<OrderHistory>> getMyOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        List<OrderHistory> orders = orderHistoryService.getOrdersByUserId(userPrincipal.getId());
//        return ResponseEntity.ok(orders);
//    }
//
//}


package com.cashback.gold.controller;

import com.cashback.gold.dto.OrderRequest;
import com.cashback.gold.dto.OrnamentCheckoutRequest;
import com.cashback.gold.dto.OrnamentPaymentCallbackRequest;
import com.cashback.gold.entity.OrderHistory;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.OrderHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        Map<String, Object> response = orderHistoryService.createOrderFromUser(request, userPrincipal);
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/checkout-cart")
//    public ResponseEntity<?> checkoutOrnamentCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//        Map<String, Object> response = orderHistoryService.createOrnamentOrderFromCart(userPrincipal);
//        return ResponseEntity.ok(response);
//    }

//    @PostMapping("/checkout/initiate")
//    public ResponseEntity<?> initiate(@AuthenticationPrincipal UserPrincipal user) {
//        return ResponseEntity.ok(orderHistoryService.initiateCheckoutOrnamentCart(user));
//    }

    @PostMapping("/checkout/initiate")
    public ResponseEntity<?> initiate(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestBody OrnamentCheckoutRequest request
    ) {
        return ResponseEntity.ok(orderHistoryService.initiateCheckoutOrnamentCart(user, request));
    }

    @PostMapping("/checkout/callback")
    public ResponseEntity<?> callback(@RequestBody OrnamentPaymentCallbackRequest request,
                                      @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(orderHistoryService.verifyCheckoutOrnamentPayment(request, user));
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

    @GetMapping("/my")
    public ResponseEntity<List<OrderHistory>> getMyOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OrderHistory> orders = orderHistoryService.getOrdersByUserId(userPrincipal.getId());
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> paymentData) {
        try {
            orderHistoryService.verifyPayment(
                    paymentData.get("razorpay_order_id"),
                    paymentData.get("razorpay_payment_id"),
                    paymentData.get("razorpay_signature")
            );
            return ResponseEntity.ok("Payment verified successfully");
        } catch (InvalidArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}