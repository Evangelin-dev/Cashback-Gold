package com.cashback.gold.entity;

import com.cashback.gold.enums.ContactStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "contact_messages",
        indexes = {
                @Index(name = "idx_contact_email", columnList = "email"),
                @Index(name = "idx_contact_phone", columnList = "phone"),
                @Index(name = "idx_contact_status", columnList = "status")
        }
)
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="first_name", nullable=false, length = 120)
    private String firstName;

    @Column(name="last_name", nullable=false, length = 120)
    private String lastName;

    @Column(nullable=false, length = 180)
    private String email;

    @Column(nullable=false, length = 32)
    private String phone;

    @Column(name="message", columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false, length = 24)
    private ContactStatus status;

    @CreationTimestamp
    @Column(name="created_at", nullable=false, columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime createdAt;
}
