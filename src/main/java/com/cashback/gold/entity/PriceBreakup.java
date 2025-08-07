package com.cashback.gold.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "price_breakups")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class PriceBreakup {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "ornament_id", nullable = false)
//    @JsonBackReference
//    private Ornament ornament;
//
//    private String component;
//
//    @Column(name = "net_weight")
//    private Double netWeight;
//
//    @Column(name = "gross_weight")
//    private Double grossWeight;
//
//    private Double discount;
//
//    @Column(name = "final_value")
//    private Double finalValue;
//
//    @Column(name = "created_at", updatable = false, insertable = false)
//    private Timestamp createdAt;
//
//    @Column(name = "updated_at", insertable = false)
//    private Timestamp updatedAt;
//}

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

