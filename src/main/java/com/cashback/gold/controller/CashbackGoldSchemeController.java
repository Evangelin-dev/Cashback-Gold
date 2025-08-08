package com.cashback.gold.controller;

import com.cashback.gold.dto.CashbackGoldSchemeRequest;
import com.cashback.gold.entity.CashbackGoldScheme;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import com.cashback.gold.service.CashbackGoldSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cashback-gold-schemes")
@RequiredArgsConstructor
public class CashbackGoldSchemeController {

    private final CashbackGoldSchemeService service;

    @GetMapping
    public ResponseEntity<List<CashbackGoldScheme>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<CashbackGoldScheme> create(@RequestBody CashbackGoldSchemeRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CashbackGoldScheme> update(@PathVariable Long id, @RequestBody CashbackGoldSchemeRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(@PathVariable Long id, @RequestParam String status) {
        service.changeStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/withdrawn")
    public ResponseEntity<List<UserCashbackGoldEnrollment>> getWithdrawnEnrollments() {
        List<UserCashbackGoldEnrollment> withdrawn = service.getWithdrawnEnrollments();
        return ResponseEntity.ok(withdrawn);
    }
}