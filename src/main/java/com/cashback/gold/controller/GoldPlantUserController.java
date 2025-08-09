package com.cashback.gold.controller;

import com.cashback.gold.dto.*;
import com.cashback.gold.scheduler.GoldPlantMonthlyYieldJob;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.GoldPlantUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/gold-plant")
@RequiredArgsConstructor
@Tag(name = "User Gold Plant Controller", description = "User APIs for Gold Plant scheme")
public class GoldPlantUserController {

    private final GoldPlantUserService goldPlantUserService;
    private final GoldPlantMonthlyYieldJob goldPlantMonthlyYieldJob;

    //    @PostMapping("/enroll")
//    public ResponseEntity<GoldPlantEnrollResponse> enroll(
//            @RequestBody GoldPlantEnrollRequest request,
//            @AuthenticationPrincipal UserPrincipal principal) {
//        System.out.println(request);
//        return ResponseEntity.ok(goldPlantUserService.enroll(request, principal));
//    }

    @Operation(summary = "Initiate Gold Plant scheme enrollment")
    @ApiResponse(responseCode = "200", description = "Enrollment initiated successfully")
    @PostMapping("/enroll/initiate")
    public ResponseEntity<?> initiateEnrollment(
            @RequestBody GoldPlantEnrollRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        Map<String, Object> response = goldPlantUserService.initiateEnrollment(request, principal);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Handle Gold Plant enrollment payment callback")
    @ApiResponse(responseCode = "200", description = "Enrollment completed successfully")
    @PostMapping("/enroll/callback")
    public ResponseEntity<GoldPlantEnrollResponse> enrollCallback(
            @RequestBody GoldPlantEnrollmentCallbackRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        GoldPlantEnrollResponse response = goldPlantUserService.handleEnrollmentCallback(request, principal);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Recall investment from Gold Plant scheme")
    @ApiResponse(responseCode = "200", description = "Investment recalled successfully")
    @PostMapping("/recall/{enrollmentId}")
    public ResponseEntity<?> recallInvestment(
            @Parameter(description = "Enrollment ID") @PathVariable Long enrollmentId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        RecallResponse response = goldPlantUserService.recall(enrollmentId, principal);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get my Gold Plant enrollments")
    @ApiResponse(responseCode = "200", description = "Enrollments fetched successfully")
    @GetMapping("/my-enrollments")
    public ResponseEntity<List<GoldPlantEnrollmentResponse>> getMyEnrollments(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(goldPlantUserService.getMyEnrollments(principal));
    }

    @Operation(summary = "Test monthly yield calculation (Manual, Admin-only)")
    @ApiResponse(responseCode = "200", description = "Monthly yield test executed")
    @PostMapping("/admin/test-yield")
    public ResponseEntity<?> testYield() {
        goldPlantMonthlyYieldJob.addMonthlyYieldToUsers();
        return ResponseEntity.ok("Done");
    }
}
