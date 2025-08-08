package com.cashback.gold.repository;

import com.cashback.gold.entity.UserSavingPayment;
import com.cashback.gold.entity.UserSavingEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserSavingPaymentRepository extends JpaRepository<UserSavingPayment, Long> {
    List<UserSavingPayment> findByEnrollment(UserSavingEnrollment enrollment);
    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM UserSavingPayment p WHERE p.enrollment.user.id = :userId")
    Double getTotalSavingInvestment(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.amountPaid), 0) FROM UserSavingPayment p WHERE p.enrollment.user.id = :userId AND MONTH(p.paymentDate) = MONTH(CURRENT_DATE) AND YEAR(p.paymentDate) = YEAR(CURRENT_DATE)")
    Double getCurrentMonthSavingInvestment(@Param("userId") Long userId);

}
