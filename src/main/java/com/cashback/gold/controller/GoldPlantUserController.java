package com.cashback.gold.controller;

import com.cashback.gold.dto.*;
import com.cashback.gold.scheduler.GoldPlantMonthlyYieldJob;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.GoldPlantUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/gold-plant")
@RequiredArgsConstructor
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

    @PostMapping("/enroll/initiate")
    public ResponseEntity<?> initiateEnrollment(@RequestBody GoldPlantEnrollRequest request,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        Map<String, Object> response = goldPlantUserService.initiateEnrollment(request, principal);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/enroll/callback")
    public ResponseEntity<GoldPlantEnrollResponse> enrollCallback(@RequestBody GoldPlantEnrollmentCallbackRequest request,
                                                                  @AuthenticationPrincipal UserPrincipal principal) {
        GoldPlantEnrollResponse response = goldPlantUserService.handleEnrollmentCallback(request, principal);
        return ResponseEntity.ok(response);
    }


    @PostMapping("/recall/{enrollmentId}")
    public ResponseEntity<?> recallInvestment(
            @PathVariable Long enrollmentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        RecallResponse response = goldPlantUserService.recall(enrollmentId, principal);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<GoldPlantEnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(goldPlantUserService.getMyEnrollments(principal));
    }

    //Testing (Manual)
    //You can test the logic by calling the method manually for now:
    @PostMapping("/admin/test-yield")
    public ResponseEntity<?> testYield() {
        goldPlantMonthlyYieldJob.addMonthlyYieldToUsers();
        return ResponseEntity.ok("Done");
    }

}
