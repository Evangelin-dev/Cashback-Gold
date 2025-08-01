package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;

    private Long userId;

    private String customerName;

    private String customerType;

    private String planType;

    private String planName;

    private String duration;

    private Double amount;

    private String paymentMethod; // COD or RAZORPAY

    private String status; // pending, completed, failed

    private LocalDateTime createdAt;

    private String address;

    // 🔽 Razorpay-specific fields
    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String razorpaySignature;

    private String receiptId;

    private String paymentStatus; // created, success, failed

    private Double cgst;

    private Double sgst;

    private Double gst;
}
