package com.cashback.gold.controller;

import com.cashback.gold.dto.UserProfileResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(userService.getUserProfile(principal));
    }

    @GetMapping("/my-investment/total")
    public ResponseEntity<Map<String, Object>> getMyTotalInvestment(@AuthenticationPrincipal UserPrincipal user) {
        BigDecimal total = userService.getTotalInvestment(user.getId());
        return ResponseEntity.ok(Map.of("totalInvestment", total));
    }

    @GetMapping("/my-investment/current-month")
    public ResponseEntity<Map<String, Object>> getMyCurrentMonthInvestment(@AuthenticationPrincipal UserPrincipal user) {
        BigDecimal currentMonth = userService.getCurrentMonthInvestment(user.getId());
        return ResponseEntity.ok(Map.of("currentMonthInvestment", currentMonth));
    }

}

