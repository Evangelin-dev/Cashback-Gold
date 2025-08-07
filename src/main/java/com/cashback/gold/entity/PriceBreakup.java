package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Entity
@Table(name = "price_breakups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceBreakup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ornament_id", nullable = false)
    private Ornament ornament;

    private String component; // e.g. "Yellow Gold", "Stone"

    private BigDecimal netWeight;
    private BigDecimal value;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}

