package com.cashback.gold.repository;

import com.cashback.gold.entity.OrderHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface OrderHistoryRepository extends JpaRepository<OrderHistory, Long>, JpaSpecificationExecutor<OrderHistory> {
    List<OrderHistory> findByUserId(Long userId);

}
