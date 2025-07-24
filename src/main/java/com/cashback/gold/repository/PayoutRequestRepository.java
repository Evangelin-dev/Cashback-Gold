package com.cashback.gold.repository;

import com.cashback.gold.entity.PayoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PayoutRequestRepository extends JpaRepository<PayoutRequest, Long> {
    List<PayoutRequest> findByPartnerIdOrderByRequestedAtDesc(Long partnerId);
}

