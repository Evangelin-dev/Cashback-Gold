package com.cashback.gold.repository;

import com.cashback.gold.entity.UserCashbackGoldPayment;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCashbackGoldPaymentRepository extends JpaRepository<UserCashbackGoldPayment, Long> {
    List<UserCashbackGoldPayment> findByEnrollment(UserCashbackGoldEnrollment enrollment);
}
