package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

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
    private Double price;
    private String category;

    @Column(name = "sub_category")
    private String subCategory;

    private String gender;

    private String description1;
    private String description2;
    private String description3;
    private String description;

    @Column(name = "main_image")
    private String mainImage;

    @Column(name = "sub_image1")
    private String subImage1;

    @Column(name = "sub_image2")
    private String subImage2;

    @Column(name = "sub_image3")
    private String subImage3;

    @Column(name = "sub_image4")
    private String subImage4;

    private String material;
    private String purity;
    private String quality;
    private String details;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at", insertable = false)
    private Timestamp updatedAt;
}
