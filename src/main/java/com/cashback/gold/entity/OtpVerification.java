package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String identifier; // email or mobile
    private String otp;
    private LocalDateTime expiresAt;
    private boolean verified;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
