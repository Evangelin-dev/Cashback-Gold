package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_cashback_gold_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class UserCashbackGoldEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "scheme_id", nullable = false)
    private CashbackGoldScheme scheme;

    @Column(name = "total_amount_paid", nullable = false)
    private BigDecimal totalAmountPaid = BigDecimal.ZERO;

    @Column(name = "gold_accumulated", nullable = false)
    private BigDecimal goldAccumulated = BigDecimal.ZERO;

    @Column(name = "activated", nullable = false)
    private boolean activated = false;

    @Column(name = "recalled", nullable = false)
    private boolean recalled = false;

    @Column(name = "recall_type")
    private String recallType; // COIN or SELL

    @Column(name = "status", nullable = false)
    private String status = "ENROLLED"; // ENROLLED, COMPLETED, CANCELLED

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
