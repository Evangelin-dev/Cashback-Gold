package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_gold_plant_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class UserGoldPlantEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "gold_plant_scheme_id", nullable = false)
    private GoldPlantScheme goldPlantScheme;

    @Column(name = "amount_invested", nullable = false)
    private BigDecimal amountInvested;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private String status; // ENROLLED, COMPLETED, WITHDRAWN, CANCELLED

    @Column(name = "gold_yield_accumulated", nullable = false)
    private BigDecimal goldYieldAccumulated;

    @Column(name = "lockin_completed", nullable = false)
    private boolean lockinCompleted;

    @Column(name = "recalled", nullable = false)
    private boolean recalled;

    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "razorpay_payment_id")
    private String razorpayPaymentId;

    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
