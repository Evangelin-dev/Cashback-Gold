package com.cashback.gold.controller;

import com.cashback.gold.dto.SIPPlanRequest;
import com.cashback.gold.dto.SIPPlanResponse;
import com.cashback.gold.service.SIPPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/admin/sip-plans")
@RequiredArgsConstructor
public class SIPPlanController {

    private final SIPPlanService service;

    @GetMapping
    public ResponseEntity<List<SIPPlanResponse>> getAll() {
        return ResponseEntity.ok(service.getAllPlans());
    }

    @PostMapping
    public ResponseEntity<SIPPlanResponse> add(@RequestBody SIPPlanRequest request) {
        return ResponseEntity.ok(service.addPlan(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SIPPlanResponse> update(@PathVariable Long id, @RequestBody SIPPlanRequest request) {
        return ResponseEntity.ok(service.updatePlan(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id, @RequestParam String status) {
        service.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        service.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}

