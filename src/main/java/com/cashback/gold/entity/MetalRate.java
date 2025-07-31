package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "metal_rates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetalRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metalType; // GOLD or SILVER

    private Double rateInrPerGram;

    private LocalDateTime fetchedAt;
}
