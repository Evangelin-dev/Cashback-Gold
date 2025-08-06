package com.cashback.gold.repository;

import com.cashback.gold.entity.Ornament;
import com.cashback.gold.entity.User;
import com.cashback.gold.entity.WishlistItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    Optional<WishlistItem> findByUserAndOrnament(User user, Ornament ornament);
    Page<WishlistItem> findAllByUser(User user, Pageable pageable);
    boolean existsByUserAndOrnament(User user, Ornament ornament);
    long countByUser(User user);
    void deleteByUserAndOrnament(User user, Ornament ornament);
}
