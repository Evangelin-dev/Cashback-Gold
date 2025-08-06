package com.cashback.gold.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AchievementDTO {
    private String key;
    private String title;
    private String desc;
    private boolean achieved;
}

