package com.cashback.gold.service;

import com.cashback.gold.dto.*;
import com.cashback.gold.entity.*;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.*;
import com.cashback.gold.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserSavingPlanService {

    private final SavingPlanRepository planRepo;
    private final UserRepository userRepo;
    private final UserSavingEnrollmentRepository enrollRepo;
    private final UserSavingPaymentRepository paymentRepo;
    private final GoldPurchaseOrderService goldPurchaseOrderService;

    public SavingPlanEnrollmentResponse enroll(SavingPlanEnrollRequest request, UserPrincipal principal) {
        User user = userRepo.findById(principal.getId()).orElseThrow();
        SavingPlan plan = planRepo.findById(request.getSavingPlanId()).orElseThrow();

        UserSavingEnrollment enrollment = UserSavingEnrollment.builder()
                .user(user)
                .savingPlan(plan)
                .startDate(LocalDate.now())
                .status(UserSavingEnrollment.EnrollmentStatus.ENROLLED)
                .accumulatedAmount(0.0)
                .accumulatedGoldGrams(0.0)
                .totalBonus(0.0)
                .extraMonths(0)
                .build();

        enrollRepo.save(enrollment);
        return buildResponse(enrollment, new ArrayList<>());
    }

    public SavingPlanEnrollmentResponse payMonthly(SavingPlanPaymentRequest request, UserPrincipal principal) {
        User user = userRepo.findById(principal.getId()).orElseThrow();
        UserSavingEnrollment enrollment = enrollRepo.findById(request.getEnrollmentId()).orElseThrow();

        if (!enrollment.getUser().getId().equals(user.getId()))
            throw new InvalidArgumentException("Unauthorized");

        int currentMonth = enrollment.getPayments().size() + 1;
        int totalMonthsAllowed = 12 + (enrollment.getExtraMonths() != null ? enrollment.getExtraMonths() : 0);

        if (currentMonth > totalMonthsAllowed) {
            throw new InvalidArgumentException("Plan already completed");
        }

        boolean onTime = LocalDate.now().getDayOfMonth() <= 5;

        double goldRatePerGram = goldPurchaseOrderService.getCurrentGoldRate();
        double goldGrams = request.getAmountPaid() / goldRatePerGram;

        double bonus = 0.0;
        if (onTime) {
            if (currentMonth == 4 || currentMonth == 10) {
                bonus = request.getAmountPaid() * 0.10;
            } else if (currentMonth == 12) {
                bonus = request.getAmountPaid() * 0.05;
            }
        }

        // Save payment
        UserSavingPayment payment = UserSavingPayment.builder()
                .enrollment(enrollment)
                .month(currentMonth)
                .paymentDate(LocalDate.now())
                .amountPaid(request.getAmountPaid())
                .goldGrams(goldGrams)
                .bonusApplied(bonus)
                .onTime(onTime)
                .build();
        paymentRepo.save(payment);

        // Update user progress
        enrollment.setAccumulatedAmount(enrollment.getAccumulatedAmount() + request.getAmountPaid());
        enrollment.setAccumulatedGoldGrams(enrollment.getAccumulatedGoldGrams() + goldGrams);
        enrollment.setTotalBonus(enrollment.getTotalBonus() + bonus);
        enrollRepo.save(enrollment);

        List<UserSavingPayment> allPayments = paymentRepo.findByEnrollment(enrollment);
        return buildResponse(enrollment, allPayments);
    }



    public SavingPlanRecallResponse recall(SavingPlanRecallRequest request, UserPrincipal principal) {
        User user = userRepo.findById(principal.getId()).orElseThrow();
        UserSavingEnrollment enrollment = enrollRepo.findById(request.getEnrollmentId()).orElseThrow();

        if (!enrollment.getUser().getId().equals(user.getId()))
            throw new InvalidArgumentException("Unauthorized");

        if (request.getAction().equals("SELL_GOLD")) {
            double serviceCharge = enrollment.getAccumulatedAmount() * 0.04;
            double finalAmount = enrollment.getAccumulatedAmount() - serviceCharge;

            enrollment.setStatus(UserSavingEnrollment.EnrollmentStatus.TERMINATED);
            enrollRepo.save(enrollment);

            return SavingPlanRecallResponse.builder()
                    .action("SELL_GOLD")
                    .accumulatedAmount(enrollment.getAccumulatedAmount())
                    .accumulatedGoldGrams(enrollment.getAccumulatedGoldGrams())
                    .serviceCharge(serviceCharge)
                    .finalReturnAmount(finalAmount)
                    .build();

        } else if (request.getAction().equals("BUY_JEWEL")) {
            return SavingPlanRecallResponse.builder()
                    .action("BUY_JEWEL")
                    .accumulatedAmount(enrollment.getAccumulatedAmount())
                    .accumulatedGoldGrams(enrollment.getAccumulatedGoldGrams())
                    .redirectTo("/buy-ornaments")
                    .build();
        } else {
            throw new InvalidArgumentException("Invalid action");
        }
    }

    public List<SavingPlanEnrollmentResponse> getMyEnrollments(UserPrincipal principal) {
        User user = userRepo.findById(principal.getId()).orElseThrow();
        List<UserSavingEnrollment> enrollments = enrollRepo.findByUser(user);
        List<SavingPlanEnrollmentResponse> responses = new ArrayList<>();

        for (UserSavingEnrollment enrollment : enrollments) {
            List<UserSavingPayment> payments = paymentRepo.findByEnrollment(enrollment);
            responses.add(buildResponse(enrollment, payments));
        }
        return responses;
    }

    private SavingPlanEnrollmentResponse buildResponse(UserSavingEnrollment e, List<UserSavingPayment> payments) {
        return SavingPlanEnrollmentResponse.builder()
                .enrollmentId(e.getId())
                .planName(e.getSavingPlan().getName())
                .startDate(e.getStartDate())
                .status(e.getStatus().name())
                .totalAmountPaid(e.getAccumulatedAmount())
                .totalGoldAccumulated(e.getAccumulatedGoldGrams())
                .totalBonus(e.getTotalBonus())
                .payments(payments.stream().map(p -> SavingPlanPaymentInfo.builder()
                        .month(p.getMonth())
                        .paymentDate(p.getPaymentDate())
                        .amountPaid(p.getAmountPaid())
                        .goldGrams(p.getGoldGrams())
                        .bonusApplied(p.getBonusApplied())
                        .onTime(p.getOnTime())
                        .build()).toList())
                .build();
    }
}
