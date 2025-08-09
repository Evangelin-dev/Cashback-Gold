package com.cashback.gold.service;

import com.cashback.gold.dto.SavingPlanRequest;
import com.cashback.gold.dto.SavingPlanResponse;
import com.cashback.gold.dto.SavingPlanTerminationAdminRow;
import com.cashback.gold.entity.SavingPlan;
import com.cashback.gold.entity.UserSavingEnrollment;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.SavingPlanRepository;
import com.cashback.gold.repository.UserSavingEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingPlanService {

    private final SavingPlanRepository repository;
    private final UserSavingEnrollmentRepository userSavingEnrollmentRepository;

    public List<SavingPlanResponse> getAllPlans() {
        return repository.findAll().stream()
                .map(plan -> SavingPlanResponse.builder()
                        .id(plan.getId())
                        .name(plan.getName())
                        .duration(plan.getDuration())
                        .amount(plan.getAmount())
                        .description(plan.getDescription())
                        .status(plan.getStatus().name())
                        .keyPoint1(plan.getKeyPoint1())
                        .keyPoint2(plan.getKeyPoint2())
                        .keyPoint3(plan.getKeyPoint3())
                        .build())
                .toList();
    }

    public SavingPlanResponse addPlan(SavingPlanRequest request) {
        SavingPlan plan = SavingPlan.builder()
                .name(request.getName())
                .duration(request.getDuration())
                .amount(request.getAmount())
                .description(request.getDescription())
                .status(SavingPlan.PlanStatus.valueOf(request.getStatus()))
                .keyPoint1(request.getKeyPoint1())
                .keyPoint2(request.getKeyPoint2())
                .keyPoint3(request.getKeyPoint3())
                .build();
        repository.save(plan);
        return SavingPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .duration(plan.getDuration())
                .amount(plan.getAmount())
                .description(plan.getDescription())
                .status(plan.getStatus().name())
                .keyPoint1(plan.getKeyPoint1())
                .keyPoint2(plan.getKeyPoint2())
                .keyPoint3(plan.getKeyPoint3())
                .build();
    }

    public SavingPlanResponse updatePlan(Long id, SavingPlanRequest request) {
        SavingPlan plan = repository.findById(id).orElseThrow(() -> new InvalidArgumentException("Not found"));
        plan.setName(request.getName());
        plan.setDuration(request.getDuration());
        plan.setAmount(request.getAmount());
        plan.setDescription(request.getDescription());
        plan.setStatus(SavingPlan.PlanStatus.valueOf(request.getStatus()));
        plan.setKeyPoint1(request.getKeyPoint1());
        plan.setKeyPoint2(request.getKeyPoint2());
        plan.setKeyPoint3(request.getKeyPoint3());
        repository.save(plan);
        return SavingPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .duration(plan.getDuration())
                .amount(plan.getAmount())
                .description(plan.getDescription())
                .status(plan.getStatus().name())
                .keyPoint1(plan.getKeyPoint1())
                .keyPoint2(plan.getKeyPoint2())
                .keyPoint3(plan.getKeyPoint3())
                .build();
    }

    public void changeStatus(Long id, String newStatus) {
        SavingPlan plan = repository.findById(id).orElseThrow(() -> new InvalidArgumentException("Not found"));
        plan.setStatus(SavingPlan.PlanStatus.valueOf(newStatus));
        repository.save(plan);
    }

    public void deletePlan(Long id) {
        repository.deleteById(id);
    }

    public List<SavingPlanTerminationAdminRow> listTerminated() {
        return userSavingEnrollmentRepository.findByStatus(UserSavingEnrollment.EnrollmentStatus.TERMINATED)
                .stream()
                .map(e -> SavingPlanTerminationAdminRow.builder()
                        .enrollmentId(e.getId())
                        .userName(e.getUser().getFullName())
                        .userEmail(e.getUser().getEmail())
                        .planName(e.getSavingPlan().getName())
                        .accumulatedAmount(e.getAccumulatedAmount())
                        .accumulatedGoldGrams(e.getAccumulatedGoldGrams())
                        .serviceCharge(e.getRecallServiceCharge())
                        .finalAmount(e.getRecallFinalAmount())
                        .status(e.getStatus().name())
                        .recallAt(e.getRecallAt())
                        .recallAction(e.getRecallAction())
                        .build())
                .toList();
    }
}

