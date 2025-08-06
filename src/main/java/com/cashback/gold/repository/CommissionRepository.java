package com.cashback.gold.repository;

import com.cashback.gold.entity.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface CommissionRepository extends JpaRepository<Commission, Long>, JpaSpecificationExecutor<Commission> {    List<Commission> findByPartnerId(Long partnerId);
    List<Commission> findByPartnerIdAndStatus(Long partnerId, String status);
    @Query("SELECT COALESCE(SUM(c.commissionAmount), 0) FROM Commission c WHERE c.partnerId = :partnerId AND c.status = 'Approved'")
    Double getApprovedCommissionSumByPartnerId(Long partnerId);
    @Query("SELECT COUNT(c) FROM Commission c WHERE c.userId = :userId")
    long countByUserId(@Param("userId") Long userId);


    // Derived counts (if you need them)
    long countByPartnerId(Long partnerId);

    // Sum for one status
    @Query("""
        select coalesce(sum(c.commissionAmount), 0) 
        from Commission c
        where c.partnerId = :partnerId
          and c.status = :status
    """)
    BigDecimal sumByPartnerAndStatus(@Param("partnerId") Long partnerId,
                                     @Param("status") String status);

    // Sum for multiple statuses
    @Query("""
        select coalesce(sum(c.commissionAmount), 0)
        from Commission c
        where c.partnerId = :partnerId
          and c.status in :statuses
    """)
    BigDecimal sumByPartnerAndStatuses(@Param("partnerId") Long partnerId,
                                       @Param("statuses") List<String> statuses);

    // Sum for one/multiple statuses in a date range
    @Query("""
        select coalesce(sum(c.commissionAmount), 0)
        from Commission c
        where c.partnerId = :partnerId
          and c.status = :status
          and c.createdAt between :from and :to
    """)
    BigDecimal sumByPartnerAndStatusBetween(@Param("partnerId") Long partnerId,
                                            @Param("status") String status,
                                            @Param("from") LocalDateTime from,
                                            @Param("to") LocalDateTime to);

    @Query("""
        select coalesce(sum(c.commissionAmount), 0)
        from Commission c
        where c.partnerId = :partnerId
          and c.status in :statuses
          and c.createdAt between :from and :to
    """)
    BigDecimal sumByPartnerAndStatusesBetween(@Param("partnerId") Long partnerId,
                                              @Param("statuses") List<String> statuses,
                                              @Param("from") LocalDateTime from,
                                              @Param("to")   LocalDateTime to);

}

