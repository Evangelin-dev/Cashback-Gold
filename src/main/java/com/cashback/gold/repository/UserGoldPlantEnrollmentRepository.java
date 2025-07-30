package com.cashback.gold.repository;

import com.cashback.gold.entity.UserGoldPlantEnrollment;
import com.cashback.gold.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGoldPlantEnrollmentRepository extends JpaRepository<UserGoldPlantEnrollment, Long> {
    List<UserGoldPlantEnrollment> findByUser(User user);
    List<UserGoldPlantEnrollment> findByUserId(Long userId);

}
