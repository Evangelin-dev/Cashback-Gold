package com.cashback.gold.repository;

import com.cashback.gold.entity.PayoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PayoutRequestRepository extends JpaRepository<PayoutRequest, Long>, JpaSpecificationExecutor<PayoutRequest> {
    List<PayoutRequest> findByPartnerIdOrderByRequestedAtDesc(Long partnerId);
}

