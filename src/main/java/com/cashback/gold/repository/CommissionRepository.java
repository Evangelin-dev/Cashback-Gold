package com.cashback.gold.repository;

import com.cashback.gold.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommissionRepository extends JpaRepository<Commission, Long>, JpaSpecificationExecutor<Commission> {    List<Commission> findByPartnerId(Long partnerId);
    List<Commission> findByPartnerIdAndStatus(Long partnerId, String status);
    @Query("SELECT COALESCE(SUM(c.commissionAmount), 0) FROM Commission c WHERE c.partnerId = :partnerId AND c.status = 'Approved'")
    Double getApprovedCommissionSumByPartnerId(Long partnerId);
}

