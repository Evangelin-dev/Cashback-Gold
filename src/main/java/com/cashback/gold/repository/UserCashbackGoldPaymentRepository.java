package com.cashback.gold.repository;

import com.cashback.gold.entity.UserCashbackGoldPayment;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserCashbackGoldPaymentRepository extends JpaRepository<UserCashbackGoldPayment, Long> {
    List<UserCashbackGoldPayment> findByEnrollment(UserCashbackGoldEnrollment enrollment);
    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM UserCashbackGoldPayment p WHERE p.enrollment.user.id = :userId")
    Double getTotalCashbackGoldInvestment(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM UserCashbackGoldPayment p WHERE p.enrollment.user.id = :userId AND MONTH(p.paymentDate) = MONTH(CURRENT_DATE) AND YEAR(p.paymentDate) = YEAR(CURRENT_DATE)")
    Double getCurrentMonthCashbackInvestment(@Param("userId") Long userId);

}
