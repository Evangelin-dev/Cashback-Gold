package com.cashback.gold.service;

import com.cashback.gold.dto.SIPPlanRequest;
import com.cashback.gold.dto.SIPPlanResponse;
import com.cashback.gold.entity.SIPPlan;
import com.cashback.gold.repository.SIPPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SIPPlanService {

    private final SIPPlanRepository repository;

    public List<SIPPlanResponse> getAllPlans() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public SIPPlanResponse addPlan(SIPPlanRequest request) {
        SIPPlan plan = SIPPlan.builder()
                .name(request.getName())
                .tenure(request.getTenure())
                .monthlyAmount(request.getMonthlyAmount())
                .description(request.getDescription())
                .status(SIPPlan.Status.valueOf(request.getStatus().toUpperCase()))
                .keyPoint1(request.getKeyPoint1())
                .keyPoint2(request.getKeyPoint2())
                .keyPoint3(request.getKeyPoint3())
                .build();

        return mapToResponse(repository.save(plan));
    }

    public SIPPlanResponse updatePlan(Long id, SIPPlanRequest request) {
        SIPPlan plan = repository.findById(id).orElseThrow();
        plan.setName(request.getName());
        plan.setTenure(request.getTenure());
        plan.setMonthlyAmount(request.getMonthlyAmount());
        plan.setDescription(request.getDescription());
        plan.setStatus(SIPPlan.Status.valueOf(request.getStatus().toUpperCase()));
        plan.setKeyPoint1(request.getKeyPoint1());
        plan.setKeyPoint2(request.getKeyPoint2());
        plan.setKeyPoint3(request.getKeyPoint3());
        return mapToResponse(repository.save(plan));
    }

    public void updateStatus(Long id, String status) {
        SIPPlan plan = repository.findById(id).orElseThrow();
        plan.setStatus(SIPPlan.Status.valueOf(status.toUpperCase()));
        repository.save(plan);
    }

    private SIPPlanResponse mapToResponse(SIPPlan plan) {
        return SIPPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .tenure(plan.getTenure())
                .monthlyAmount(plan.getMonthlyAmount())
                .description(plan.getDescription())
                .status(plan.getStatus().name())
                .keyPoint1(plan.getKeyPoint1())
                .keyPoint2(plan.getKeyPoint2())
                .keyPoint3(plan.getKeyPoint3())
                .build();
    }

    public void deletePlan(Long id) {
        SIPPlan plan = repository.findById(id).orElseThrow();
        repository.delete(plan);
    }
}

