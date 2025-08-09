package com.cashback.gold.controller;

import com.cashback.gold.dto.FaqRequest;
import com.cashback.gold.entity.Faq;
import com.cashback.gold.enums.FaqType;
import com.cashback.gold.service.FaqService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
@Tag(name = "FAQ Controller", description = "Manage FAQs By Admin")
public class FaqController {

    private final FaqService faqService;

    @Operation(summary = "Create a new FAQ")
    @ApiResponse(responseCode = "200", description = "FAQ created successfully")
    @PostMapping
    public ResponseEntity<Faq> create(@RequestBody FaqRequest request) {
        return ResponseEntity.ok(faqService.create(request));
    }

    @Operation(summary = "Update an existing FAQ")
    @ApiResponse(responseCode = "200", description = "FAQ updated successfully")
    @PutMapping("/{id}")
    public ResponseEntity<Faq> update(
            @Parameter(description = "FAQ ID") @PathVariable Long id,
            @RequestBody FaqRequest request
    ) {
        return ResponseEntity.ok(faqService.update(id, request));
    }

    @Operation(summary = "Delete a FAQ")
    @ApiResponse(responseCode = "204", description = "FAQ deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "FAQ ID") @PathVariable Long id
    ) {
        faqService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get all FAQs with optional filters and pagination")
    @ApiResponse(responseCode = "200", description = "FAQs fetched successfully")
    @GetMapping
    public ResponseEntity<Page<Faq>> getAll(
            @Parameter(description = "Search text") @RequestParam(defaultValue = "") String search,
            @Parameter(description = "FAQ type filter") @RequestParam(required = false) FaqType type,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "5") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return ResponseEntity.ok(faqService.list(search, type, pageable));
    }
}
