package com.cashback.gold.repository;

import com.cashback.gold.entity.Nominee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NomineeRepository extends JpaRepository<Nominee, Long> {
    List<Nominee> findByUserId(Long userId);
}
