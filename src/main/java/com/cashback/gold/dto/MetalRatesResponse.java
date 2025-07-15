package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MetalRatesResponse {
    private Double goldRateInrPerGram;
    private Double silverRateInrPerGram;
    private LocalDateTime fetchedAt;
}

