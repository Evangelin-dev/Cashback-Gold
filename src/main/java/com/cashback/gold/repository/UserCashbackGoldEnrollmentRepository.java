package com.cashback.gold.repository;

import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import com.cashback.gold.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCashbackGoldEnrollmentRepository extends JpaRepository<UserCashbackGoldEnrollment, Long> {
    List<UserCashbackGoldEnrollment> findByUser(User user);

    List<UserCashbackGoldEnrollment> findByUserId(Long userId);

}
