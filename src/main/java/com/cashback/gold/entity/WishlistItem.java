package com.cashback.gold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "wishlist_items",
        uniqueConstraints = @UniqueConstraint(name = "uk_wishlist_user_ornament", columnNames = {"user_id","ornament_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many items belong to one user
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_wishlist_user"))
    private User user;

    // Each item references one ornament
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ornament_id", nullable = false, foreignKey = @ForeignKey(name = "fk_wishlist_ornament"))
    private Ornament ornament;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;
}

