package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Entity
@Table(name = "ornaments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ornament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "gold_per_gram_price")
    private BigDecimal goldPerGramPrice;

    private String category;
    private String subCategory;
    private String itemType;

    private String details;
    private String description;
    private String description1;
    private String description2;
    private String description3;

    private String material;
    private String purity;
    private String quality;
    private String warranty;

    @Column(nullable = false)
    private String origin;

    @Column(name = "making_charge_percent", nullable = false)
    private BigDecimal makingChargePercent;

    @Column(name = "gross_weight")
    private BigDecimal grossWeight;

    private BigDecimal discount;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "total_price_after_discount", nullable = false)
    private Double totalPriceAfterDiscount;


    @Column(name = "main_image")
    private String mainImage;

    // ✅ Store PostgreSQL TEXT[] as Java List<String>
    @Column(name = "sub_images", columnDefinition = "TEXT[]")
    private List<String> subImages;

    @OneToMany(mappedBy = "ornament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PriceBreakup> priceBreakups;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
