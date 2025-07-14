package com.cashback.gold.entity;

import com.cashback.gold.exception.InvalidArgumentException;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wallet_id", nullable = false)
    private Wallet wallet;

    @Column(name = "type", nullable = false)
    private String type; // TOPUP, PURCHASE

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, COMPLETED, FAILED

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void validateFields() {
        if (!type.matches("TOPUP|PURCHASE")) {
            throw new InvalidArgumentException("Type must be TOPUP or PURCHASE");
        }
        if (!status.matches("PENDING|COMPLETED|FAILED")) {
            throw new InvalidArgumentException("Status must be PENDING, COMPLETED, or FAILED");
        }
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidArgumentException("Amount must be positive");
        }
    }
}