package com.cashback.gold.service;

import com.cashback.gold.dto.SavingPlanRequest;
import com.cashback.gold.dto.SavingPlanResponse;
import com.cashback.gold.entity.SavingPlan;
import com.cashback.gold.repository.SavingPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavingPlanService {

    private final SavingPlanRepository repository;

    public List<SavingPlanResponse> getAllPlans() {
        return repository.findAll().stream()
                .map(plan -> SavingPlanResponse.builder()
                        .id(plan.getId())
                        .name(plan.getName())
                        .duration(plan.getDuration())
                        .amount(plan.getAmount())
                        .description(plan.getDescription())
                        .status(plan.getStatus().name())
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
                .build();
        repository.save(plan);
        return SavingPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .duration(plan.getDuration())
                .amount(plan.getAmount())
                .description(plan.getDescription())
                .status(plan.getStatus().name())
                .build();
    }

    public SavingPlanResponse updatePlan(Long id, SavingPlanRequest request) {
        SavingPlan plan = repository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        plan.setName(request.getName());
        plan.setDuration(request.getDuration());
        plan.setAmount(request.getAmount());
        plan.setDescription(request.getDescription());
        plan.setStatus(SavingPlan.PlanStatus.valueOf(request.getStatus()));
        repository.save(plan);
        return SavingPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .duration(plan.getDuration())
                .amount(plan.getAmount())
                .description(plan.getDescription())
                .status(plan.getStatus().name())
                .build();
    }

    public void changeStatus(Long id, String newStatus) {
        SavingPlan plan = repository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        plan.setStatus(SavingPlan.PlanStatus.valueOf(newStatus));
        repository.save(plan);
    }

    public void deletePlan(Long id) {
        repository.deleteById(id);
    }
}

