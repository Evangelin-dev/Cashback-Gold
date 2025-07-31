package com.cashback.gold.repository;

import com.cashback.gold.entity.MetalRateHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetalRateHistoryRepository extends JpaRepository<MetalRateHistory, Long> {
}

