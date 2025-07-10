package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName; // ✅ NEW
    private String lastName;  // ✅ NEW

    private String email;
    private String mobile;
    private String password; // may be null if only OTP login

    private String role;
    private String status; // PENDING / APPROVED / REJECTED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
