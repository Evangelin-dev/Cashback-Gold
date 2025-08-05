package com.cashback.gold.controller;

import com.cashback.gold.dto.ReferralCodeResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/partner")
@RequiredArgsConstructor
public class ParnerReferralController {

    private final UserService userService;

    @GetMapping("/referral-code")
    public ResponseEntity<ReferralCodeResponse> getReferralCode(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        ReferralCodeResponse response = userService.getReferralCode(userPrincipal);
        return ResponseEntity.ok(response);
    }
}
