package com.cashback.gold.repository;

import com.cashback.gold.entity.UserGoldPlantEnrollment;
import com.cashback.gold.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserGoldPlantEnrollmentRepository extends JpaRepository<UserGoldPlantEnrollment, Long> {
    List<UserGoldPlantEnrollment> findByUser(User user);
    List<UserGoldPlantEnrollment> findByUserId(Long userId);
    @Query("SELECT COALESCE(SUM(e.amountInvested), 0) FROM UserGoldPlantEnrollment e WHERE e.user.id = :userId")
    Double getTotalGoldPlantInvestment(@Param("userId") Long userId);


    @Query("SELECT COALESCE(SUM(e.amountInvested), 0) FROM UserGoldPlantEnrollment e WHERE e.user.id = :userId AND MONTH(e.startDate) = MONTH(CURRENT_DATE) AND YEAR(e.startDate) = YEAR(CURRENT_DATE)")
    Double getCurrentMonthGoldPlantInvestment(@Param("userId") Long userId);

    List<UserGoldPlantEnrollment> findByStatusOrderByRecallAtDesc(String status);

}
