package com.cashback.gold.controller;

import com.cashback.gold.dto.CashbackGoldEnrollmentRequest;
import com.cashback.gold.dto.CashbackGoldPaymentCallbackRequest;
import com.cashback.gold.dto.CashbackGoldPaymentRequest;
import com.cashback.gold.dto.CashbackGoldRecallRequest;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.CashbackGoldUserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cashback-gold-user")
@RequiredArgsConstructor
public class CashbackGoldUserController {

    private final CashbackGoldUserService userService;

    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(@RequestBody CashbackGoldEnrollmentRequest request,
                                    @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.enroll(request, principal));
    }

//    @PostMapping("/pay")
//    public ResponseEntity<?> pay(@RequestBody CashbackGoldPaymentRequest request,
//                                 @AuthenticationPrincipal UserPrincipal principal) {
//        return ResponseEntity.ok(userService.pay(request, principal));
//    }

    @PostMapping("/pay/initiate")
    public ResponseEntity<?> initiatePay(@RequestBody CashbackGoldPaymentRequest request,
                                         @AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> response = userService.initiatePayment(request, principal.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/pay/callback")
    @Transactional
    public ResponseEntity<?> payCallback(@RequestBody CashbackGoldPaymentCallbackRequest request,
                                         @AuthenticationPrincipal UserPrincipal principal) {
        UserCashbackGoldEnrollment updatedEnrollment =
                userService.handlePaymentCallback(request, principal.getId());
        return ResponseEntity.ok(updatedEnrollment);
    }

    @PostMapping("/recall")
    public ResponseEntity<?> recall(@RequestBody CashbackGoldRecallRequest request,
                                    @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.recall(request, principal));
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<?> myEnrollments(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getMyEnrollments(principal));
    }
}

