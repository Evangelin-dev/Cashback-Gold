package com.cashback.gold.controller;

import com.cashback.gold.dto.UserCountResponse;
import com.cashback.gold.dto.UserResponse;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.UserService;
import com.cashback.gold.service.admin.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminService adminService;
    private final UserService userService;

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approveUser(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectUser(id));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getUsersByTypePaginated(
            @RequestParam("type") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(userService.getUsersByTypePaginated(type, page, size));
    }

    @GetMapping("/counts")
    public ResponseEntity<UserCountResponse> getUserCounts() {
        return ResponseEntity.ok(userService.getUserCountsByRole());
    }
}

