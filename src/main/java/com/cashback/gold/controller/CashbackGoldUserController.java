package com.cashback.gold.controller;

import com.cashback.gold.dto.*;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.CashbackGoldUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cashback-gold-user")
@RequiredArgsConstructor
@Tag(name = "Cashback Gold User Controller", description = "User APIs for Cashback Gold scheme")
public class CashbackGoldUserController {

    private final CashbackGoldUserService userService;

    @Operation(summary = "Enroll in Cashback Gold scheme")
    @ApiResponse(responseCode = "200", description = "Enrollment successful")
    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(
            @RequestBody CashbackGoldEnrollmentRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(userService.enroll(request, principal));
    }

    //    @PostMapping("/pay")
//    public ResponseEntity<?> pay(@RequestBody CashbackGoldPaymentRequest request,
//                                 @AuthenticationPrincipal UserPrincipal principal) {
//        return ResponseEntity.ok(userService.pay(request, principal));
//    }

    @Operation(summary = "Initiate payment for Cashback Gold scheme")
    @ApiResponse(responseCode = "200", description = "Payment initiation successful")
    @PostMapping("/pay/initiate")
    public ResponseEntity<?> initiatePay(
            @RequestBody CashbackGoldPaymentRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Map<String, Object> response = userService.initiatePayment(request, principal.getId());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Handle payment callback for Cashback Gold scheme")
    @ApiResponse(responseCode = "200", description = "Payment processed successfully")
    @PostMapping("/pay/callback")
    @Transactional
    public ResponseEntity<?> payCallback(
            @RequestBody CashbackGoldPaymentCallbackRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        UserCashbackGoldEnrollment updatedEnrollment =
                userService.handlePaymentCallback(request, principal.getId());
        return ResponseEntity.ok(updatedEnrollment);
    }

    @Operation(summary = "Recall an enrollment")
    @ApiResponse(responseCode = "200", description = "Recall processed successfully")
    @PostMapping("/recall")
    public ResponseEntity<?> recall(
            @RequestBody CashbackGoldRecallRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(userService.recall(request, principal));
    }

    @Operation(summary = "Get my Cashback Gold enrollments")
    @ApiResponse(responseCode = "200", description = "Enrollments fetched successfully")
    @GetMapping("/my-enrollments")
    public ResponseEntity<?> myEnrollments(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(userService.getMyEnrollments(principal));
    }

    @Operation(summary = "Get all recalled enrollments")
    @ApiResponse(responseCode = "200", description = "Recalled enrollments fetched successfully")
    @GetMapping("/recalls")
    public List<CashbackGoldRecallResponse> getAllRecalls() {
        return userService.getAllRecalledEnrollments();
    }
}
