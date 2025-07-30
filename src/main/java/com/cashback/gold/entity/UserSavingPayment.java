package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_saving_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSavingPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private UserSavingEnrollment enrollment;

    private Integer month; // Month number from start (1 to 12)

    private LocalDate paymentDate;

    private Double amountPaid;

    private Double goldGrams;

    private Double bonusApplied;

    private Boolean onTime; // true = bonus eligible
}
