package com.cashback.gold.service;

import com.cashback.gold.dto.*;
import com.cashback.gold.entity.*;
import com.cashback.gold.enums.EnrollmentStatus;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.*;
import com.cashback.gold.security.UserPrincipal;
import com.razorpay.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CashbackGoldUserService {

    private final CashbackGoldSchemeRepository schemeRepo;
    private final UserCashbackGoldEnrollmentRepository enrollmentRepo;
    private final UserCashbackGoldPaymentRepository paymentRepo;
    private final GoldPurchaseOrderService goldRateService;
    private final UserRepository userRepository;
    private final RazorpayService razorpayService;

    @Transactional
    public Object enroll(CashbackGoldEnrollmentRequest request, UserPrincipal principal) {
        CashbackGoldScheme scheme = schemeRepo.findById(request.getSchemeId())
                .orElseThrow(() -> new InvalidArgumentException("Scheme not found"));

        User user = userRepository.findById(principal.getId()).orElseThrow();

        UserCashbackGoldEnrollment enrollment = UserCashbackGoldEnrollment.builder()
                .user(user)
                .scheme(scheme)
                .totalAmountPaid(BigDecimal.ZERO)
                .goldAccumulated(BigDecimal.ZERO)
                .activated(false)
                .recalled(false)
                .recallType(null)
                .status(EnrollmentStatus.ENROLLED.name())
                .createdAt(LocalDateTime.now())
                .build();

        return enrollmentRepo.save(enrollment);
    }

//    @Transactional
//    public Object pay(CashbackGoldPaymentRequest request, UserPrincipal principal) {
//        UserCashbackGoldEnrollment enrollment = enrollmentRepo.findById(request.getEnrollmentId())
//                .orElseThrow(() -> new InvalidArgumentException("Enrollment not found"));
//
//        if (!enrollment.getUser().getId().equals(principal.getId())) {
//            throw new InvalidArgumentException("Unauthorized access to enrollment");
//        }
//
//        double goldRate = goldRateService.getCurrentGoldRate(); // ₹ per gram
//        double amountDouble = request.getAmountPaid();
//        BigDecimal amount = BigDecimal.valueOf(amountDouble);
//
//        // Round goldGrams to 4 decimal places
//        BigDecimal goldGrams = BigDecimal.valueOf(amountDouble / goldRate)
//                .setScale(4, RoundingMode.HALF_UP);
//
//        UserCashbackGoldPayment payment = UserCashbackGoldPayment.builder()
//                .enrollment(enrollment)
//                .amountPaid(amount)
//                .goldGrams(goldGrams)
//                .paymentDate(LocalDate.now())
//                .build();
//
//        paymentRepo.save(payment);
//
//        enrollment.setTotalAmountPaid(enrollment.getTotalAmountPaid().add(amount));
//        enrollment.setGoldAccumulated(enrollment.getGoldAccumulated().add(goldGrams));
//
//        if (!enrollment.isActivated()
//                && enrollment.getGoldAccumulated().compareTo(BigDecimal.valueOf(1.0)) >= 0) {
//            enrollment.setActivated(true);
//        }
//
//        return enrollmentRepo.save(enrollment);
//    }

        public Map<String, Object> initiatePayment(CashbackGoldPaymentRequest request, Long userId) {
            UserCashbackGoldEnrollment enrollment = enrollmentRepo.findById(request.getEnrollmentId())
                    .orElseThrow(() -> new InvalidArgumentException("Enrollment not found"));

            if (!enrollment.getUser().getId().equals(userId)) {
                throw new InvalidArgumentException("Unauthorized access");
            }

            Order order = razorpayService.createOrder(
                    BigDecimal.valueOf(request.getAmountPaid()), "PAY_" + UUID.randomUUID());

            Map<String, Object> response = new HashMap<>();
            response.put("razorpayOrderId", order.get("id"));
            response.put("amount", request.getAmountPaid());
            response.put("enrollmentId", request.getEnrollmentId());

            return response;
        }

    public UserCashbackGoldEnrollment handlePaymentCallback(CashbackGoldPaymentCallbackRequest request, Long userId) {
        boolean valid = razorpayService.verifySignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (!valid) {
            throw new InvalidArgumentException("Invalid Razorpay payment signature.");
        }

        UserCashbackGoldEnrollment enrollment = enrollmentRepo.findById(request.getEnrollmentId())
                .orElseThrow(() -> new InvalidArgumentException("Enrollment not found"));

        if (!enrollment.getUser().getId().equals(userId)) {
            throw new InvalidArgumentException("Unauthorized access to enrollment");
        }

        double goldRate = goldRateService.getCurrentGoldRate();
        BigDecimal amount = BigDecimal.valueOf(request.getAmountPaid());

        BigDecimal goldGrams = BigDecimal.valueOf(request.getAmountPaid() / goldRate)
                .setScale(4, RoundingMode.HALF_UP);

        // Save Razorpay payment details
        razorpayService.savePayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                amount,
                "PAY",
                enrollment.getId()
        );

        // Save the CashbackGold payment
        UserCashbackGoldPayment payment = UserCashbackGoldPayment.builder()
                .enrollment(enrollment)
                .amountPaid(amount)
                .goldGrams(goldGrams)
                .paymentDate(LocalDate.now())
                .build();
        paymentRepo.save(payment);

        // Update Enrollment
        enrollment.setTotalAmountPaid(enrollment.getTotalAmountPaid().add(amount));
        enrollment.setGoldAccumulated(enrollment.getGoldAccumulated().add(goldGrams));

        if (!enrollment.isActivated() &&
                enrollment.getGoldAccumulated().compareTo(BigDecimal.valueOf(1.0)) >= 0) {
            enrollment.setActivated(true);
        }

        return enrollmentRepo.save(enrollment);
    }

    @Transactional
    public Object recall(CashbackGoldRecallRequest request, UserPrincipal principal) {
        UserCashbackGoldEnrollment enrollment = enrollmentRepo.findById(request.getEnrollmentId())
                .orElseThrow(() -> new InvalidArgumentException("Enrollment not found"));

        if (!enrollment.getUser().getId().equals(principal.getId())) {
            throw new InvalidArgumentException("Unauthorized");
        }

        if (!enrollment.isActivated()) {
            throw new InvalidArgumentException("Scheme not activated yet (less than 1 gm gold accumulated)");
        }

        if (enrollment.isRecalled()) {
            throw new InvalidArgumentException("Already recalled");
        }

        enrollment.setRecalled(true);
        enrollment.setStatus(EnrollmentStatus.WITHDRAWN.name());
        enrollment.setRecallType(request.getRecallType());

        if ("SELL".equalsIgnoreCase(request.getRecallType())) {
            // Apply 4% deduction
            BigDecimal deduction = enrollment.getTotalAmountPaid().multiply(BigDecimal.valueOf(0.04));
            BigDecimal finalAmount = enrollment.getTotalAmountPaid().subtract(deduction);
            // Simulate payment to user
            System.out.println("Refund ₹" + finalAmount + " will be credited in 3 days.");
        } else if ("COIN".equalsIgnoreCase(request.getRecallType())) {
            System.out.println("1 gm coin (999) will be dispatched");
        }

        return enrollmentRepo.save(enrollment);
    }

    public Object getMyEnrollments(UserPrincipal principal) {
        List<UserCashbackGoldEnrollment> enrollments = enrollmentRepo.findByUserId(principal.getId());
        return enrollments.stream().map(e -> CashbackGoldEnrollmentResponse.builder()
                        .enrollmentId(e.getId())
                        .schemeName(e.getScheme().getName())
                        .totalPaid(e.getTotalAmountPaid())
                        .goldAccumulated(e.getGoldAccumulated())
                        .activated(e.isActivated())
                        .recalled(e.isRecalled())
                        .status(EnrollmentStatus.valueOf(e.getStatus()))
                        .build())
                .collect(Collectors.toList());
    }
}
