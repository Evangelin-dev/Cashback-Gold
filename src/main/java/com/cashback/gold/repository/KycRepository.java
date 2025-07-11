package com.cashback.gold.repository;

import com.cashback.gold.entity.KycDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KycRepository extends JpaRepository<KycDocument, Long> {
    Optional<KycDocument> findTopByUserIdAndUserTypeOrderBySubmittedAtDesc(Long userId, String userType);
    Page<KycDocument> findByUserType(String userType, Pageable pageable);
}