package com.cashback.gold.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class SupportTicketResponse {
    private Long id;
    private Long userId;
    private String subject;
    private String message;
    private String status;
    private LocalDateTime submittedAt;
}
