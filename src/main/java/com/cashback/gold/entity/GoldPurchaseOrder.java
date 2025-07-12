package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "gold_purchase_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoldPurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String customerName;
    private String customerType; // user | b2b

    private double quantity; // grams
    private double pricePerGram;
    private double totalAmount;

    private String deliveryMethod;  // Delivery | Pickup
    private String paymentMethod;   // Wallet, UPI, etc.
    private String status;          // pending | processing | completed | cancelled

    private LocalDateTime createdAt;
}

