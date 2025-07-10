package com.cashback.gold.controller;

import com.cashback.gold.dto.MarketingResourceRequest;
import com.cashback.gold.dto.MarketingResourceResponse;
import com.cashback.gold.service.MarketingResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin/marketing-resources")
@RequiredArgsConstructor
public class MarketingResourceController {

    private final MarketingResourceService marketingResourceService;

    /**
     * Upload a new marketing resource
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<MarketingResourceResponse> upload(
            @RequestPart("data") MarketingResourceRequest request,
            @RequestPart("file") MultipartFile file
    ) {
        System.out.println(request +" "+ file);
        MarketingResourceResponse response = marketingResourceService.uploadResource(request, file);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all uploaded resources
     */
    @GetMapping
    public ResponseEntity<List<MarketingResourceResponse>> getAll() {
        return ResponseEntity.ok(marketingResourceService.getAll());
    }

    /**
     * Update metadata (title/description) of a resource
     */
    @PutMapping("/{id}")
    public ResponseEntity<MarketingResourceResponse> update(
            @PathVariable Long id,
            @RequestBody MarketingResourceRequest request
    ) {
        return ResponseEntity.ok(marketingResourceService.update(id, request));
    }

    /**
     * Delete a resource by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        marketingResourceService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggle active/inactive status of a resource
     */
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Long id) {
        marketingResourceService.toggleStatus(id);
        return ResponseEntity.noContent().build();
    }
}
