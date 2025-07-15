package com.cashback.gold.dto;

import com.cashback.gold.enums.FlyerType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FlyerResponse {
    private Long id;
    private String url;
    private FlyerType type;
    private LocalDateTime uploadDate;
}

