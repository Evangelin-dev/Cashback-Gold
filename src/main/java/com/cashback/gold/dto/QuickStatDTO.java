package com.cashback.gold.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuickStatDTO {
    private String label;
    private String value;
    private String icon; // e.g., "fas fa-user-friends"
}

