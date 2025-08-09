package com.cashback.gold.controller;

import com.cashback.gold.dto.GoldPlantSchemeRequest;
import com.cashback.gold.entity.GoldPlantScheme;
import com.cashback.gold.service.GoldPlantSchemeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gold-plants")
@RequiredArgsConstructor
@Tag(name = "Admin Gold Plant Scheme Controller", description = "Admin APIs to manage Gold Plant Schemes")
public class GoldPlantSchemeController {

    private final GoldPlantSchemeService service;

    @Operation(summary = "Get all Gold Plant schemes (Admin)")
    @ApiResponse(responseCode = "200", description = "Schemes fetched successfully")
    @GetMapping
    public ResponseEntity<List<GoldPlantScheme>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @Operation(summary = "Create a new Gold Plant scheme (Admin)")
    @ApiResponse(responseCode = "200", description = "Scheme created successfully")
    @PostMapping
    public ResponseEntity<GoldPlantScheme> create(@RequestBody GoldPlantSchemeRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @Operation(summary = "Update an existing Gold Plant scheme (Admin)")
    @ApiResponse(responseCode = "200", description = "Scheme updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<GoldPlantScheme> update(
            @Parameter(description = "Scheme ID") @PathVariable Long id,
            @RequestBody GoldPlantSchemeRequest req
    ) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @Operation(summary = "Delete a Gold Plant scheme (Admin)")
    @ApiResponse(responseCode = "204", description = "Scheme deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "Scheme ID") @PathVariable Long id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Change status of a Gold Plant scheme (Admin)")
    @ApiResponse(responseCode = "200", description = "Scheme status updated successfully")
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(
            @Parameter(description = "Scheme ID") @PathVariable Long id,
            @Parameter(description = "New status") @RequestParam String status
    ) {
        service.changeStatus(id, status);
        return ResponseEntity.ok().build();
    }
}
