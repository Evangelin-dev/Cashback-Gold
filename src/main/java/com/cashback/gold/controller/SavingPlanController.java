package com.cashback.gold.controller;
import com.cashback.gold.dto.SavingPlanRequest;
import com.cashback.gold.dto.SavingPlanResponse;
import com.cashback.gold.service.SavingPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/saving-plans")
@RequiredArgsConstructor
public class SavingPlanController {

    private final SavingPlanService service;

    @GetMapping
    public ResponseEntity<List<SavingPlanResponse>> getAll() {
        return ResponseEntity.ok(service.getAllPlans());
    }

    @PostMapping
    public ResponseEntity<SavingPlanResponse> add(@RequestBody SavingPlanRequest request) {
        return ResponseEntity.ok(service.addPlan(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SavingPlanResponse> update(@PathVariable Long id, @RequestBody SavingPlanRequest request) {
        return ResponseEntity.ok(service.updatePlan(id, request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(@PathVariable Long id, @RequestParam String status) {
        service.changeStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}

