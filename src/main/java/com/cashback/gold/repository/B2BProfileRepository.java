package com.cashback.gold.repository;

import com.cashback.gold.entity.B2BProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface B2BProfileRepository extends JpaRepository<B2BProfile, Long> {
    Optional<B2BProfile> findByUserId(Long userId);
}