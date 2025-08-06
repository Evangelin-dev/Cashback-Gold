package com.cashback.gold.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class KpiDTO {
    private String label;
    private String value;
    private String trend;       // "+12%" or "-3%"
    private String icon;        // "fas fa-chart-line"
    private String color;       // Tailwind gradient class
    private String borderColor; // Tailwind border class
}
