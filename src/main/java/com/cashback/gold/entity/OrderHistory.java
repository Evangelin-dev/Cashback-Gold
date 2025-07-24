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

    private String orderId;  // like ORD-2025-001

    private Long userId; // foreign key to user table (optional if anonymous)

    private String customerName;

    private String customerType; // "user" or "b2b"

    private String planType; // "CHIT", "SIP", "GOLD_PLANT"

    private String planName;

    private String duration; // eg. "12 months", "36 months"

    private Double amount;

    private String paymentMethod;

    private String status; // pending, completed, failed, etc.

    private LocalDateTime createdAt;

    private String address;
}
