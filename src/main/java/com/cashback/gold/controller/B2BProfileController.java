package com.cashback.gold.controller;

import com.cashback.gold.dto.B2BProfileRequest;
import com.cashback.gold.dto.B2BProfileResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.B2BProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/b2b/profile")
@RequiredArgsConstructor
@Tag(name = "B2B Profile Controller", description = "B2B profile management APIs (Deprecated)")
@Deprecated
public class B2BProfileController {

    private final B2BProfileService b2bProfileService;

    @Operation(summary = "Get B2B profile", deprecated = true)
    @GetMapping
    public ResponseEntity<B2BProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(b2bProfileService.getProfile(userPrincipal.getId()));
    }

    @Operation(summary = "Update B2B profile", deprecated = true)
    @PutMapping
    public ResponseEntity<B2BProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody B2BProfileRequest request
    ) {
        return ResponseEntity.ok(b2bProfileService.updateProfile(userPrincipal.getId(), request));
    }

    @Operation(summary = "Save new B2B profile", deprecated = true)
    @PostMapping
    public ResponseEntity<B2BProfileResponse> saveProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody B2BProfileRequest request
    ) {
        return ResponseEntity.ok(b2bProfileService.saveProfile(userPrincipal.getId(), request));
    }
}
