package com.cashback.gold.service;

import com.cashback.gold.dto.*;
import com.cashback.gold.entity.GoldPlantScheme;
import com.cashback.gold.entity.User;
import com.cashback.gold.entity.UserGoldPlantEnrollment;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.GoldPlantSchemeRepository;
import com.cashback.gold.repository.UserGoldPlantEnrollmentRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import com.razorpay.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoldPlantUserService {

    private final UserRepository userRepository;
    private final GoldPlantSchemeRepository schemeRepository;
    private final UserGoldPlantEnrollmentRepository userGoldPlantEnrollmentRepository;
    private final RazorpayService razorpayService;

//    public GoldPlantEnrollResponse enroll(GoldPlantEnrollRequest request, UserPrincipal principal) {
//        User user = userRepository.findById(principal.getId()).orElseThrow();
//        GoldPlantScheme scheme = schemeRepository.findById(request.getSchemeId())
//                .orElseThrow(() -> new InvalidArgumentException("Invalid scheme"));
//
//        BigDecimal minAmount = new BigDecimal(scheme.getMinInvest());
//        if (request.getAmountInvested().compareTo(minAmount) < 0) {
//            throw new InvalidArgumentException("Minimum investment is ₹" + minAmount);
//        }
//
//        UserGoldPlantEnrollment enrollment = UserGoldPlantEnrollment.builder()
//                .user(user)
//                .goldPlantScheme(scheme)
//                .amountInvested(request.getAmountInvested())
//                .startDate(LocalDate.now())
//                .status("ENROLLED")
//                .goldYieldAccumulated(BigDecimal.ZERO)
//                .lockinCompleted(false)
//                .recalled(false)
//                .build();
//
//        enrollment = userGoldPlantEnrollmentRepository.save(enrollment);
//
//        return GoldPlantEnrollResponse.builder()
//                .enrollmentId(enrollment.getId())
//                .schemeName(scheme.getName())
//                .amountInvested(request.getAmountInvested())
//                .startDate(enrollment.getStartDate())
//                .status(enrollment.getStatus())
//                .build();
//    }

    public Map<String, Object> initiateEnrollment(GoldPlantEnrollRequest request, UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        GoldPlantScheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new InvalidArgumentException("Invalid scheme"));

        // Remove ₹ or other characters
        String rawMinInvest = scheme.getMinInvest().replaceAll("[^\\d.]", "");
        BigDecimal minAmount = new BigDecimal(rawMinInvest);

        if (request.getAmountInvested().compareTo(minAmount) < 0) {
            throw new InvalidArgumentException("Minimum investment is ₹" + minAmount);
        }

        String receipt = "ENROLL_" + UUID.randomUUID().toString().substring(0, 8);
        Order order = razorpayService.createOrder(request.getAmountInvested(), receipt);

        Map<String, Object> response = new HashMap<>();
        response.put("razorpayOrderId", order.get("id"));
        response.put("amount", request.getAmountInvested());
        response.put("schemeId", scheme.getId());

        return response;
    }


    public GoldPlantEnrollResponse handleEnrollmentCallback(GoldPlantEnrollmentCallbackRequest request, UserPrincipal principal) {
        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!valid) {
            throw new InvalidArgumentException("Invalid Razorpay signature");
        }

        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found"));

        GoldPlantScheme scheme = schemeRepository.findById(request.getSchemeId())
                .orElseThrow(() -> new InvalidArgumentException("Invalid scheme"));

        UserGoldPlantEnrollment enrollment = UserGoldPlantEnrollment.builder()
                .user(user)
                .goldPlantScheme(scheme)
                .amountInvested(request.getAmountInvested())
                .startDate(LocalDate.now())
                .status("ENROLLED")
                .razorpayPaymentId(request.getRazorpayPaymentId())
                .razorpayOrderId(request.getRazorpayOrderId())
                .razorpaySignature(request.getRazorpaySignature())
                .goldYieldAccumulated(BigDecimal.ZERO)
                .lockinCompleted(false)
                .recalled(false)
                .build();

        enrollment = userGoldPlantEnrollmentRepository.save(enrollment);

        razorpayService.savePayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                request.getAmountInvested(),
                "ENROLL",
                enrollment.getId()
        );

        return GoldPlantEnrollResponse.builder()
                .enrollmentId(enrollment.getId())
                .schemeName(scheme.getName())
                .amountInvested(enrollment.getAmountInvested())
                .startDate(enrollment.getStartDate())
                .status(enrollment.getStatus())
                .build();
    }


    public RecallResponse recall(Long enrollmentId, UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        UserGoldPlantEnrollment enrollment = userGoldPlantEnrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new InvalidArgumentException("Enrollment not found"));

        if (!enrollment.getUser().getId().equals(user.getId())) {
            throw new InvalidArgumentException("Unauthorized");
        }

        if (enrollment.getStatus().equals("RECALLED") || enrollment.getStatus().equals("COMPLETED")) {
            throw new InvalidArgumentException("Already recalled or completed");
        }

        BigDecimal refundAmount;
        boolean penalty;

        long months = ChronoUnit.MONTHS.between(enrollment.getStartDate(), LocalDate.now());
        if (months < 36) {
            // Penalty 50%
            refundAmount = enrollment.getAmountInvested().multiply(BigDecimal.valueOf(0.5));
            penalty = true;
        } else {
            refundAmount = enrollment.getAmountInvested();
            penalty = false;
        }

        enrollment.setStatus("RECALLED");
        userGoldPlantEnrollmentRepository.save(enrollment);

        return new RecallResponse(
                enrollment.getId(),
                "RECALLED",
                refundAmount.setScale(2, RoundingMode.HALF_UP).doubleValue(),
                penalty,
                penalty
                        ? "Emergency recall done with 50% penalty"
                        : "Recall successful. Full refund issued."
        );
    }

    public List<GoldPlantEnrollmentResponse> getMyEnrollments(UserPrincipal principal) {
        List<UserGoldPlantEnrollment> enrollments = userGoldPlantEnrollmentRepository.findByUserId(principal.getId());
        return enrollments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private GoldPlantEnrollmentResponse toDto(UserGoldPlantEnrollment enrollment) {
        return GoldPlantEnrollmentResponse.builder()
                .enrollmentId(enrollment.getId())
                .planName(enrollment.getGoldPlantScheme().getName())
                .startDate(enrollment.getStartDate())
                .status(enrollment.getStatus())
                .investedAmount(enrollment.getAmountInvested())
                .goldAccumulated(enrollment.getGoldYieldAccumulated())
                .lockinCompleted(enrollment.isLockinCompleted())
                .recalled(enrollment.isRecalled())
                .build();
    }

}
