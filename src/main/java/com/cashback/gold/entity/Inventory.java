package com.cashback.gold.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_stock", nullable = false)
    private Double totalStock; // in grams or kg based on unit

    @Column(name = "in_store_stock", nullable = false)
    private Double inStoreStock;

    @Column(name = "gold_stock", nullable = false)
    private Double goldStock;

    @Column(name = "silver_stock", nullable = false)
    private Double silverStock;

    @Column(name = "diamond_stock", nullable = false)
    private Double diamondStock;

    @Column(name = "unit", nullable = false)
    private String unit; // g or kg

    private LocalDateTime updatedAt;
}

