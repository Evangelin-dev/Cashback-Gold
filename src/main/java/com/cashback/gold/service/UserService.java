package com.cashback.gold.service;

import com.cashback.gold.dto.UserResponse;
import com.cashback.gold.entity.User;
import com.cashback.gold.repository.UserRepository;
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

}
