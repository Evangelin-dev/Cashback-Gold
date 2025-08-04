package com.cashback.gold.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "razorpay_payment")  // ✅ explicitly sets the table name
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private BigDecimal amount;
    private String paymentType; // PAY_MONTHLY, PAY, ENROLL, ORNAMENTS

    private Long enrollmentId;
    private LocalDateTime createdAt;
}
