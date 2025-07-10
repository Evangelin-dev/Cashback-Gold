package com.cashback.gold.service;
import com.cashback.gold.dto.AdminProfileResponse;
import com.cashback.gold.dto.AdminProfileUpdateRequest;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.service.aws.S3Service;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AdminProfileService {

    private final UserRepository userRepo;
    private final S3Service s3Service;

    public AdminProfileResponse getProfile() {
        User user = getLoggedInAdmin();
        return AdminProfileResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getMobile())
                .role(user.getRole())
                .build();
    }

    public ApiResponse updateProfile(AdminProfileUpdateRequest req, MultipartFile avatar) {
        User user = getLoggedInAdmin();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setMobile(req.getPhone());
        user.setRole(req.getRole());
        userRepo.save(user);
        return ApiResponse.success("Profile updated successfully");
    }

    private User getLoggedInAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new InvalidArgumentException("Admin not found"));
    }

}

