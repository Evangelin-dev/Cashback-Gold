package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String type;

    @Column(name = "aadhar_or_gst_url")
    private String doc1Url;

    @Column(name = "pan_or_agreement_url")
    private String doc2Url;

    private String status; // PENDING, APPROVED, REJECTED

    private LocalDateTime submittedAt;
}
