package com.cashback.gold.controller;

import com.cashback.gold.dto.CampaignRequest;
import com.cashback.gold.dto.CampaignResponse;
import com.cashback.gold.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaign Controller", description = "Manage campaigns (Deprecated)")
@Deprecated
public class CampaignController {

    private final CampaignService campaignService;

    @Operation(summary = "Create a new campaign", deprecated = true)
    @PostMapping
    public ResponseEntity<CampaignResponse> create(@RequestBody CampaignRequest request) {
        return ResponseEntity.ok(campaignService.addCampaign(request));
    }

    @Operation(summary = "Update an existing campaign", deprecated = true)
    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponse> update(@PathVariable Long id, @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(campaignService.updateCampaign(id, request));
    }

    @Operation(summary = "Get all campaigns", deprecated = true)
    @GetMapping
    public ResponseEntity<List<CampaignResponse>> getAll() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    @Operation(summary = "Delete a campaign", deprecated = true)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok().build();
    }
}
