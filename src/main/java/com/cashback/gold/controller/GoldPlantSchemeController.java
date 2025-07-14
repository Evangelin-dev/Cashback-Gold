package com.cashback.gold.controller;

import com.cashback.gold.dto.GoldPlantSchemeRequest;
import com.cashback.gold.entity.GoldPlantScheme;
import com.cashback.gold.service.GoldPlantSchemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gold-plants")
@RequiredArgsConstructor
public class GoldPlantSchemeController {

    private final GoldPlantSchemeService service;

    @GetMapping
    public ResponseEntity<List<GoldPlantScheme>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<GoldPlantScheme> create(@RequestBody GoldPlantSchemeRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoldPlantScheme> update(@PathVariable Long id, @RequestBody GoldPlantSchemeRequest req) {
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

}

