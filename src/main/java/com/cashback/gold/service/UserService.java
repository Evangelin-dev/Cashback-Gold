package com.cashback.gold.service;

import com.cashback.gold.dto.*;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    public Page<UserResponse> getUsersByTypePaginated(String type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> userPage = userRepository.findByRoleIgnoreCase(type.toUpperCase(), pageable);

        return userPage.map(this::toResponse);
    }


    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    public UserCountResponse getUserCountsByRole() {
        long userCount = userRepository.countByRoleIgnoreCase("USER");
        long partnerCount = userRepository.countByRoleIgnoreCase("PARTNER");
        long b2bCount = userRepository.countByRoleIgnoreCase("B2B");
        return new UserCountResponse(userCount, partnerCount, b2bCount);
    }

    public UserStatsResponse getUserStats() {
        long total = userRepository.count();
        long partners = userRepository.countByRole("PARTNER");
        long b2b = userRepository.countByRole("B2B");

        return new UserStatsResponse(total, partners, b2b);
    }

    public ReferralCodeResponse getReferralCode(UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        if (!"PARTNER".equalsIgnoreCase(user.getRole())) {
            throw new InvalidArgumentException("Referral code is only available for PARTNER role users.");
        }

        return new ReferralCodeResponse(user.getId(), user.getReferralCode());
    }

    public UserProfileResponse getUserProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        return new UserProfileResponse(
                user.getFullName(),
                user.getDob(),
                user.getGender(),
                user.getEmail(),
                user.getMobile(),
                user.getCity(),
                user.getTown(),
                user.getState(),
                user.getCountry()
        );
    }

}
