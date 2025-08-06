package com.cashback.gold.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PartnerDashboardResponse {
    private List<QuickStatDTO> quickStats;
    private List<KpiDTO> kpis;
    private String availableBalance; // "₹13,000"
    private List<AchievementDTO> achievements;
}

