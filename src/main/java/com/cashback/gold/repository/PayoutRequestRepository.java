package com.cashback.gold.repository;

import com.cashback.gold.entity.PayoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;

public interface PayoutRequestRepository extends JpaRepository<PayoutRequest, Long>, JpaSpecificationExecutor<PayoutRequest> {
    List<PayoutRequest> findByPartnerIdOrderByRequestedAtDesc(Long partnerId);

    @Query("""
        select coalesce(sum(p.amount), 0)
        from PayoutRequest p
        where p.partnerId = :partnerId
          and p.status in :statuses
    """)
    BigDecimal sumByPartnerAndStatuses(@Param("partnerId") Long partnerId,
                                       @Param("statuses") Collection<String> statuses);

    long countByPartnerIdAndStatus(Long partnerId, String status);
}

