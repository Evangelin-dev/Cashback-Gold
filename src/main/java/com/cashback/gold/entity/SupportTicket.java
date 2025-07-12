package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String status; // e.g., "OPEN", "RESOLVED"

    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}
