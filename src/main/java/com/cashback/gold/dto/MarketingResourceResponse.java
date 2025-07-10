package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MarketingResourceResponse {
    private Long id;
    private String title;
    private String description;
    private String fileName;
    private String fileType;
    private LocalDateTime uploadDate;
    private String status;
    private int downloadCount;
    private String fileUrl;
}



