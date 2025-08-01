package com.cashback.gold.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "commissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "partner_id")
    private Long partnerId;

    private Long userId;

    private String orderType; // SIP, CHIT, GOLD, ORNAMENT

    private Double orderAmount;

    private Double commissionAmount;

    @Builder.Default
    private String status = "Pending"; // Pending or Approved

    private LocalDateTime createdAt;

    @Column(name = "level")
    private Integer level; // 1, 2, 3

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", insertable = false, updatable = false)
    @JsonIgnore
    private User partner;
}

