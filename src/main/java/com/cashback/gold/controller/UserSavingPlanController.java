package com.cashback.gold.controller;

import com.cashback.gold.dto.*;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.UserSavingPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-savings")
@RequiredArgsConstructor
public class UserSavingPlanController {

    private final UserSavingPlanService service;

    @PostMapping("/enroll")
    public ResponseEntity<?> enroll(@RequestBody SavingPlanEnrollRequest request,
                                    @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.enroll(request, userPrincipal));
    }

    @PostMapping("/pay-monthly")
    public ResponseEntity<?> payMonthly(@RequestBody SavingPlanPaymentRequest request,
                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.payMonthly(request, userPrincipal));
    }

    @PostMapping("/recall")
    public ResponseEntity<?> recallScheme(@RequestBody SavingPlanRecallRequest request,
                                          @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.recall(request, userPrincipal));
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<SavingPlanEnrollmentResponse>> myEnrollments(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.getMyEnrollments(userPrincipal));
    }
}
