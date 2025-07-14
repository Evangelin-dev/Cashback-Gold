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
@Table(name = "wallets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "balance", nullable = false)
    private BigDecimal balance;

    @Column(name = "credit_limit", nullable = false)
    private BigDecimal creditLimit;

    @Column(name = "used_credit", nullable = false)
    private BigDecimal usedCredit;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    private void validateFields() {
        if (balance.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidArgumentException("Balance cannot be negative");
        }
        if (creditLimit.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidArgumentException("Credit limit cannot be negative");
        }
        if (usedCredit.compareTo(BigDecimal.ZERO) < 0 || usedCredit.compareTo(creditLimit) > 0) {
            throw new InvalidArgumentException("Used credit must be between 0 and credit limit");
        }
    }
}