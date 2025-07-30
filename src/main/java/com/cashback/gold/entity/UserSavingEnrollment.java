package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "user_saving_enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSavingEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "saving_plan_id")
    private SavingPlan savingPlan;

    private LocalDate startDate;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status; // ENROLLED, COMPLETED, TERMINATED

    private Double accumulatedGoldGrams;

    private Double accumulatedAmount;

    private Double totalBonus;

    private Integer extraMonths = 0;

    @OneToMany(mappedBy = "enrollment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserSavingPayment> payments;

    public enum EnrollmentStatus {
        ENROLLED,
        COMPLETED,
        TERMINATED
    }
}
