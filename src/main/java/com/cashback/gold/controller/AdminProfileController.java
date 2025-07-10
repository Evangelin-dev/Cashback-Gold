package com.cashback.gold.controller;
import com.cashback.gold.dto.AdminProfileResponse;
import com.cashback.gold.dto.AdminProfileUpdateRequest;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.AdminProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService profileService;

    @GetMapping
    public ResponseEntity<AdminProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getProfile());
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse> updateProfile(
            @RequestPart("data") AdminProfileUpdateRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar
    ) {
        return ResponseEntity.ok(profileService.updateProfile(request, avatar));
    }
}

