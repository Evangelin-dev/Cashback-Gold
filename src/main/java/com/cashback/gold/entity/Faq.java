package com.cashback.gold.entity;

import com.cashback.gold.enums.FaqType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "faqs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faq {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;
    private String answer;

    @Enumerated(EnumType.STRING)
    private FaqType type; // Enum: HOME, CHIT, SIP, SCHEME

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

