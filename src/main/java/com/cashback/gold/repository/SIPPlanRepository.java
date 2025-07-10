package com.cashback.gold.repository;

import com.cashback.gold.entity.SIPPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SIPPlanRepository extends JpaRepository<SIPPlan, Long> {
}

