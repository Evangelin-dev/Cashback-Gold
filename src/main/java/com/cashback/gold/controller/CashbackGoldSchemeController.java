package com.cashback.gold.controller;

import com.cashback.gold.dto.CashbackGoldSchemeRequest;
import com.cashback.gold.entity.CashbackGoldScheme;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import com.cashback.gold.service.CashbackGoldSchemeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cashback-gold-schemes")
@RequiredArgsConstructor
@Tag(name = "Admin Cashback Gold Scheme Controller", description = "Admin APIs to manage Cashback Gold Schemes")
public class CashbackGoldSchemeController {

    private final CashbackGoldSchemeService service;

    @Operation(summary = "Get all Cashback Gold schemes (Admin)")
    @ApiResponse(responseCode = "200", description = "Schemes fetched successfully")
    @GetMapping
    public ResponseEntity<List<CashbackGoldScheme>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @Operation(summary = "Create a new Cashback Gold scheme (Admin)")
    @ApiResponse(responseCode = "200", description = "Scheme created successfully")
    @PostMapping
    public ResponseEntity<CashbackGoldScheme> create(@RequestBody CashbackGoldSchemeRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @Operation(summary = "Update an existing Cashback Gold scheme (Admin)")
    @ApiResponse(responseCode = "200", description = "Scheme updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<CashbackGoldScheme> update(
            @Parameter(description = "Scheme ID") @PathVariable Long id,
            @RequestBody CashbackGoldSchemeRequest req
    ) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @Operation(summary = "Delete a Cashback Gold scheme (Admin)")
    @ApiResponse(responseCode = "204", description = "Scheme deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "Scheme ID") @PathVariable Long id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Change status of a Cashback Gold scheme (Admin)")
    @ApiResponse(responseCode = "200", description = "Scheme status updated successfully")
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(
            @Parameter(description = "Scheme ID") @PathVariable Long id,
            @Parameter(description = "New status") @RequestParam String status
    ) {
        service.changeStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get all withdrawn Cashback Gold enrollments (Admin)")
    @ApiResponse(responseCode = "200", description = "Withdrawn enrollments fetched successfully")
    @GetMapping("/withdrawn")
    public ResponseEntity<List<UserCashbackGoldEnrollment>> getWithdrawnEnrollments() {
        List<UserCashbackGoldEnrollment> withdrawn = service.getWithdrawnEnrollments();
        return ResponseEntity.ok(withdrawn);
    }
}
