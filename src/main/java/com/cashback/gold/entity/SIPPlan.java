package com.cashback.gold.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sip_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SIPPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String tenure;
    private String monthlyAmount;
    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private String keyPoint1;
    private String keyPoint2;
    private String keyPoint3;

    public enum Status {
        ACTIVE, CLOSED
    }
}

