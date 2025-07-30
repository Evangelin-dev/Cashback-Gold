package com.cashback.gold.repository;

import com.cashback.gold.entity.UserSavingPayment;
import com.cashback.gold.entity.UserSavingEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSavingPaymentRepository extends JpaRepository<UserSavingPayment, Long> {
    List<UserSavingPayment> findByEnrollment(UserSavingEnrollment enrollment);
}
