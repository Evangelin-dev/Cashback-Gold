package com.cashback.gold.entity;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "metal_rate_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetalRateHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metalType; // GOLD / SILVER
    private Double rateInrPerGram;
    private LocalDateTime fetchedAt;
}

