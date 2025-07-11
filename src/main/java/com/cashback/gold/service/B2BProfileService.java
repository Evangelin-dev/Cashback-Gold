package com.cashback.gold.service;

import com.cashback.gold.dto.B2BProfileRequest;
import com.cashback.gold.dto.B2BProfileResponse;
import com.cashback.gold.entity.B2BProfile;
import com.cashback.gold.entity.User;
import com.cashback.gold.repository.B2BProfileRepository;
import com.cashback.gold.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class B2BProfileService {

    private final B2BProfileRepository b2bProfileRepo;
    private final UserRepository userRepo;

    public B2BProfileResponse getProfile(Long userId) {
        User user = validateUser(userId, "B2B");
        B2BProfile profile = b2bProfileRepo.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("B2B profile not found for user"));
        return toB2BProfileResponse(profile, user.getStatus());
    }

    public B2BProfileResponse updateProfile(Long userId, B2BProfileRequest request) {
        User user = validateUser(userId, "B2B");

        // Validate required fields
        if (request.getCompanyName() == null || request.getGstin() == null ||
                request.getPan() == null || request.getBankAccount() == null ||
                request.getTeamEmail() == null) {
            throw new IllegalArgumentException("Company name, GSTIN, PAN, bank account, and team email are required for B2B profile");
        }

        // Find or create profile
        B2BProfile profile = b2bProfileRepo.findByUserId(userId)
                .orElse(B2BProfile.builder().userId(userId).build());

        // Update fields
        profile.setCompanyName(request.getCompanyName());
        profile.setGstin(request.getGstin());
        profile.setPan(request.getPan());
        profile.setAddress(request.getAddress());
        profile.setBankAccount(request.getBankAccount());
        profile.setUpi(request.getUpi());
        profile.setTeamEmail(request.getTeamEmail());

        b2bProfileRepo.save(profile);
        return toB2BProfileResponse(profile, user.getStatus());
    }

    private User validateUser(Long userId, String expectedRole) {
        return userRepo.findById(userId)
                .filter(user -> expectedRole.equals(user.getRole()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid user or role"));
    }

    public B2BProfileResponse saveProfile(Long userId, B2BProfileRequest request) {
        User user = validateUser(userId, "B2B");

        // Validate required fields
        if (request.getCompanyName() == null || request.getGstin() == null ||
                request.getPan() == null || request.getBankAccount() == null ||
                request.getTeamEmail() == null) {
            throw new IllegalArgumentException("Company name, GSTIN, PAN, bank account, and team email are required for B2B profile");
        }

        // Check if profile exists, update or create
        B2BProfile profile = b2bProfileRepo.findByUserId(userId)
                .orElse(B2BProfile.builder().userId(userId).build());

        // Update fields
        profile.setCompanyName(request.getCompanyName());
        profile.setGstin(request.getGstin());
        profile.setPan(request.getPan());
        profile.setAddress(request.getAddress());
        profile.setBankAccount(request.getBankAccount());
        profile.setUpi(request.getUpi());
        profile.setTeamEmail(request.getTeamEmail());

        b2bProfileRepo.save(profile);
        return toB2BProfileResponse(profile, user.getStatus());
    }

    private B2BProfileResponse toB2BProfileResponse(B2BProfile profile, String userStatus) {
        return B2BProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .companyName(profile.getCompanyName())
                .gstin(profile.getGstin())
                .pan(profile.getPan())
                .address(profile.getAddress())
                .bankAccount(profile.getBankAccount())
                .upi(profile.getUpi())
                .teamEmail(profile.getTeamEmail())
                .status(userStatus)
                .createdAt(profile.getCreatedAt() != null ? profile.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .updatedAt(profile.getUpdatedAt() != null ? profile.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null)
                .build();
    }
}