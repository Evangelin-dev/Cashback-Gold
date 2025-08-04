package com.cashback.gold.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "ornaments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ornament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "total_gram")
    private Double totalGram;

    @Column(name = "gram_price")
    private Double gramPrice;

    @Column(name = "total_price")
    private Double totalPrice;

    private String category;

    @Column(name = "sub_category")
    private String subCategory;

    private String gender;

    @Column(name = "item_type")
    private String itemType;

    private String description;
    private String description1;
    private String description2;
    private String description3;

    private String material;
    private String purity;
    private String quality;
    private String warranty;
    private String details;

    @Column(nullable = false)
    private String origin;

    @Column(name = "making_charge_percent", nullable = false)
    private Double makingChargePercent;

    @Column(name = "main_image")
    private String mainImage;

    @Column(name = "sub_images", columnDefinition = "TEXT[]")
    private String[] subImages;

    @OneToMany(mappedBy = "ornament", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PriceBreakup> priceBreakups;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", insertable = false)
    private Timestamp updatedAt;
}
