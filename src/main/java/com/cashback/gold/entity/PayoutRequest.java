package com.cashback.gold.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payout_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayoutRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long partnerId;
    private Double amount;
    private String method;          // UPI, Bank, Paytm
    private String methodDetail;    // UPI ID or Bank Account
    private String status;          // Pending, Paid, Rejected

    private LocalDateTime requestedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partnerId", referencedColumnName = "id", insertable = false, updatable = false)
    private User partner;


    @PrePersist
    public void prePersist() {
        this.requestedAt = LocalDateTime.now();
        if (this.status == null) this.status = "Pending";
    }
}

