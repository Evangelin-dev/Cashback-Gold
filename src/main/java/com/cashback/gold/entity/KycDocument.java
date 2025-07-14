package com.cashback.gold.entity;

import com.cashback.gold.exception.InvalidArgumentException;
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

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "user_type")
    private String userType;

    @Column(name = "aadhar_url")
    private String aadharUrl;

    @Column(name = "pan_url")
    private String panUrl;

    @Column(name = "gst_certificate_url")
    private String gstCertificateUrl;

    @Column(name = "pan_card_url")
    private String panCardUrl;

    @Column(name = "address_proof_url")
    private String addressProofUrl;

    @Column(name = "bank_statement_url")
    private String bankStatementUrl;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "submitted_at", nullable = false)
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @PrePersist
    @PreUpdate
    private void validateStatus() {
        if (!"PENDING".equals(status) && !"APPROVED".equals(status) && !"REJECTED".equals(status)) {
            throw new InvalidArgumentException("Status must be PENDING, APPROVED, or REJECTED");
        }
    }
}