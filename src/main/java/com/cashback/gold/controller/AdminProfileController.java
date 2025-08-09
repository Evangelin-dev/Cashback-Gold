package com.cashback.gold.controller;

import com.cashback.gold.dto.AdminProfileResponse;
import com.cashback.gold.dto.AdminProfileUpdateRequest;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.AdminProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
@Tag(name = "Admin Profile Controller", description = "Manage admin profile and avatar")
public class AdminProfileController {

    private final AdminProfileService profileService;

    @Operation(summary = "Get admin profile")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile fetched successfully")
    @GetMapping
    public ResponseEntity<AdminProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @Operation(summary = "Update admin profile")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> updateProfile(
            @Parameter(description = "Profile JSON (AdminProfileUpdateRequest)") @RequestPart("data") AdminProfileUpdateRequest request,
            @Parameter(description = "Optional avatar image file") @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return ResponseEntity.ok(profileService.updateProfile(request, avatar));
    }
}
