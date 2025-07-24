package com.cashback.gold.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

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
    @JsonBackReference
    private Ornament ornament;

    private String component;

    @Column(name = "gold_rate_18kt")
    private Double goldRate18kt;

    @Column(name = "weight_g")
    private Double weightG;

    private Double discount;

    @Column(name = "final_value")
    private Double finalValue;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", insertable = false)
    private Timestamp updatedAt;
}