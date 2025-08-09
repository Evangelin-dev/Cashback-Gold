package com.cashback.gold.controller;

import com.cashback.gold.dto.UserCountResponse;
import com.cashback.gold.dto.UserResponse;
import com.cashback.gold.dto.UserStatsResponse;
import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.service.UserService;
import com.cashback.gold.service.admin.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Controller", description = "Admin APIs for managing users")
public class AdminUserController {

    private final AdminService adminService;
    private final UserService userService;

    @Operation(summary = "Approve a user by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User approved successfully")
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveUser(
            @Parameter(description = "User ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.approveUser(id));
    }

    @Operation(summary = "Reject a user by ID")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User rejected successfully")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectUser(
            @Parameter(description = "User ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok(adminService.rejectUser(id));
    }

    @Operation(summary = "Get paginated users by type")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users fetched successfully")
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getUsersByTypePaginated(
            @Parameter(description = "User type (USER, PARTNER, B2B)") @RequestParam("type") String type,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(userService.getUsersByTypePaginated(type, page, size));
    }

    @Operation(summary = "Get user counts by role")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User counts fetched successfully")
    @GetMapping("/counts")
    public ResponseEntity<UserCountResponse> getUserCounts() {
        return ResponseEntity.ok(userService.getUserCountsByRole());
    }

    @Operation(summary = "Get user statistics")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User statistics fetched successfully")
    @GetMapping("/stats")
    public ResponseEntity<UserStatsResponse> getStats() {
        return ResponseEntity.ok(userService.getUserStats());
    }
}
