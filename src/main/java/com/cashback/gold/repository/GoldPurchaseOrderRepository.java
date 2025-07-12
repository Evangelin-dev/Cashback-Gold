package com.cashback.gold.repository;

import com.cashback.gold.entity.GoldPurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoldPurchaseOrderRepository extends JpaRepository<GoldPurchaseOrder, Long> {
    List<GoldPurchaseOrder> findAllByOrderByCreatedAtDesc();
    List<GoldPurchaseOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
}

