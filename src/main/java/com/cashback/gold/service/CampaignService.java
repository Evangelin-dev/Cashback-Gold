package com.cashback.gold.service;

import com.cashback.gold.dto.CampaignRequest;
import com.cashback.gold.dto.CampaignResponse;
import com.cashback.gold.entity.Campaign;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;

    private static final List<String> VALID_STATUSES = List.of("ACTIVE", "INACTIVE", "SCHEDULED");

    public CampaignResponse addCampaign(CampaignRequest request) {
        try {
            validateCampaignRequest(request);
            Campaign campaign = Campaign.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .multiplier(cleanMultiplier(request.getMultiplier()))
                    .status(cleanStatus(request.getStatus()))
                    .build();

            Campaign saved = campaignRepository.save(campaign);
            return mapToResponse(saved);
        } catch (IllegalArgumentException e) {
            throw new InvalidArgumentException("Failed to add campaign: " + e.getMessage());
        } catch (Exception e) {
            throw new InvalidArgumentException("Unexpected error while adding campaign: " + e.getMessage());
        }
    }

    public CampaignResponse updateCampaign(Long id, CampaignRequest request) {
        try {
            if (id == null || id <= 0) {
                throw new InvalidArgumentException("Invalid campaign ID");
            }
            validateCampaignRequest(request);

            Campaign campaign = campaignRepository.findById(id)
                    .orElseThrow(() -> new InvalidArgumentException("Campaign not found with ID: " + id));

            campaign.setName(request.getName());
            campaign.setDescription(request.getDescription());
            campaign.setStartDate(request.getStartDate());
            campaign.setEndDate(request.getEndDate());
            campaign.setMultiplier(cleanMultiplier(request.getMultiplier()));
            campaign.setStatus(cleanStatus(request.getStatus()));

            return mapToResponse(campaignRepository.save(campaign));
        } catch (InvalidArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidArgumentException("Unexpected error while updating campaign: " + e.getMessage());
        }
    }

    public void deleteCampaign(Long id) {
        try {
            if (id == null || id <= 0) {
                throw new InvalidArgumentException("Invalid campaign ID");
            }
            if (!campaignRepository.existsById(id)) {
                throw new InvalidArgumentException("Campaign not found with ID: " + id);
            }
            campaignRepository.deleteById(id);
        } catch (InvalidArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new InvalidArgumentException("Unexpected error while deleting campaign: " + e.getMessage());
        }
    }

    public List<CampaignResponse> getAllCampaigns() {
        try {
            return campaignRepository.findAll().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new InvalidArgumentException("Unexpected error while retrieving campaigns: " + e.getMessage());
        }
    }

    private void validateCampaignRequest(CampaignRequest request) {
        if (Objects.isNull(request)) {
            throw new InvalidArgumentException("Campaign request cannot be null");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new InvalidArgumentException("Campaign name cannot be empty");
        }
        if (request.getName().length() > 255) {
            throw new InvalidArgumentException("Campaign name cannot exceed 255 characters");
        }
        if (request.getDescription() != null && request.getDescription().length() > 1000) {
            throw new InvalidArgumentException("Campaign description cannot exceed 1000 characters");
        }
        if (request.getStartDate() == null) {
            throw new InvalidArgumentException("Start date cannot be null");
        }
        if (request.getEndDate() == null) {
            throw new InvalidArgumentException("End date cannot be null");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new InvalidArgumentException("End date cannot be before start date");
        }
        if (request.getMultiplier() == null || !isValidMultiplier(request.getMultiplier())) {
            throw new InvalidArgumentException("Invalid multiplier format. Expected a number or a number followed by 'x' (e.g., '2' or '2x')");
        }
        if (request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            throw new InvalidArgumentException("Campaign status cannot be empty");
        }

        String cleanedStatus = cleanStatus(request.getStatus());
        if (!VALID_STATUSES.contains(cleanedStatus)) {
            throw new InvalidArgumentException("Invalid status. Allowed values are: ACTIVE, INACTIVE, SCHEDULED");
        }
    }

    private boolean isValidMultiplier(String multiplier) {
        if (multiplier == null) {
            return false;
        }
        String cleaned = multiplier.replaceAll("[xX]$", "").trim();
        try {
            Double.parseDouble(cleaned);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private String cleanMultiplier(String multiplier) {
        return multiplier.replaceAll("[xX]$", "").trim();
    }

    private String cleanStatus(String status) {
        return status == null ? null : status.trim().toUpperCase();
    }

    private CampaignResponse mapToResponse(Campaign campaign) {
        if (campaign == null) {
            throw new InvalidArgumentException("Cannot map null campaign to response");
        }
        return CampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getName())
                .description(campaign.getDescription())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .multiplier(campaign.getMultiplier())
                .status(campaign.getStatus())
                .createdAt(campaign.getCreatedAt())
                .updatedAt(campaign.getUpdatedAt())
                .build();
    }
}
