package com.cashback.gold.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saving_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String duration; // e.g., "12 months"

    private String amount; // e.g., "₹1000/mo"

    private String description;

    @Enumerated(EnumType.STRING)
    private PlanStatus status; // ACTIVE or CLOSED

    public enum PlanStatus {
        ACTIVE,
        CLOSED
    }
}

