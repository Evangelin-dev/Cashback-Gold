package com.cashback.gold.service.admin;

import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;

    public ApiResponse approveUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        user.setStatus("APPROVED");
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);

        return new ApiResponse(true, "User approved successfully");
    }

    public ApiResponse rejectUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        user.setStatus("REJECTED");
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);

        return new ApiResponse(true, "User rejected successfully");
    }
}

