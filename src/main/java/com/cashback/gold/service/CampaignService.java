package com.cashback.gold.service;

import com.cashback.gold.dto.CampaignRequest;
import com.cashback.gold.dto.CampaignResponse;
import com.cashback.gold.entity.Campaign;
import com.cashback.gold.repository.CampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;

    public CampaignResponse addCampaign(CampaignRequest request) {
        Campaign campaign = Campaign.builder()
                .name(request.getName())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .multiplier(request.getMultiplier())
                .status(request.getStatus())
                .build();

        Campaign saved = campaignRepository.save(campaign);
        return mapToResponse(saved);
    }

    public CampaignResponse updateCampaign(Long id, CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow(() -> new RuntimeException("Campaign not found"));
        campaign.setName(request.getName());
        campaign.setDescription(request.getDescription());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setMultiplier(request.getMultiplier());
        campaign.setStatus(request.getStatus());

        return mapToResponse(campaignRepository.save(campaign));
    }

    public void deleteCampaign(Long id) {
        campaignRepository.deleteById(id);
    }

    public List<CampaignResponse> getAllCampaigns() {
        return campaignRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CampaignResponse mapToResponse(Campaign campaign) {
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
