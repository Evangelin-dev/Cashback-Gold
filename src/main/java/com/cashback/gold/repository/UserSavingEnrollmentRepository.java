package com.cashback.gold.repository;

import com.cashback.gold.entity.UserSavingEnrollment;
import com.cashback.gold.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSavingEnrollmentRepository extends JpaRepository<UserSavingEnrollment, Long> {
    List<UserSavingEnrollment> findByUser(User user);
}
