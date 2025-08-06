package com.cashback.gold.controller;

import com.cashback.gold.dto.PartnerDashboardResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.PartnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/partner/dashboard")
public class PartnerDashboardController {

    private final PartnerDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<PartnerDashboardResponse> get(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(dashboardService.getDashboard(principal));
    }
}
