package com.cashback.gold.controller;

import com.cashback.gold.dto.MarketingResourceRequest;
import com.cashback.gold.dto.MarketingResourceResponse;
import com.cashback.gold.service.MarketingResourceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/marketing-resources")
@RequiredArgsConstructor
@Tag(name = "Marketing Resource Controller", description = "Manage marketing resources (Deprecated)")
@Deprecated
public class MarketingResourceController {

    private final MarketingResourceService marketingResourceService;

    @Operation(summary = "Upload a new marketing resource", deprecated = true)
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<MarketingResourceResponse> upload(
            @RequestPart("data") MarketingResourceRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        System.out.println(request + " " + file);
        MarketingResourceResponse response = marketingResourceService.uploadResource(request, file);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all uploaded resources", deprecated = true)
    @GetMapping
    public ResponseEntity<List<MarketingResourceResponse>> getAll() {
        return ResponseEntity.ok(marketingResourceService.getAll());
    }

    @Operation(summary = "Update metadata (title/description) of a resource", deprecated = true)
    @PutMapping("/{id}")
    public ResponseEntity<MarketingResourceResponse> update(
            @PathVariable Long id,
            @RequestBody MarketingResourceRequest request
    ) {
        return ResponseEntity.ok(marketingResourceService.update(id, request));
    }

    @Operation(summary = "Delete a resource by ID", deprecated = true)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        marketingResourceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Toggle active/inactive status of a resource", deprecated = true)
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Long id) {
        marketingResourceService.toggleStatus(id);
        return ResponseEntity.noContent().build();
    }
}
