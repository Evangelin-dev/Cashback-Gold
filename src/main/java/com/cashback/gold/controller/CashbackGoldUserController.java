package com.cashback.gold.controller;

import com.cashback.gold.dto.CashbackGoldEnrollmentRequest;
import com.cashback.gold.dto.CashbackGoldPaymentRequest;
import com.cashback.gold.dto.CashbackGoldRecallRequest;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.CashbackGoldUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/pay")
    public ResponseEntity<?> pay(@RequestBody CashbackGoldPaymentRequest request,
                                 @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.pay(request, principal));
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

