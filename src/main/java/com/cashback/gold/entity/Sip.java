package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sips")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private String plan;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Column(nullable = false)
    private String status = "Active";

    @Column(nullable = false)
    private String commission = "₹0";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "created_by")
    private Long createdBy; // Just user ID of B2B creator
}

