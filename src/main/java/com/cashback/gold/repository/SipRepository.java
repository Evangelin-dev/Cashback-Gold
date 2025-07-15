package com.cashback.gold.repository;

import com.cashback.gold.entity.Sip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SipRepository extends JpaRepository<Sip, Long> {
    @Query("SELECT s FROM Sip s WHERE s.user.fullName LIKE %:query% OR s.user.email LIKE %:query% OR s.user.mobile LIKE %:query%")
    List<Sip> searchSips(@Param("query") String query);
    List<Sip> findByUserId(Long userId);
    List<Sip> findByCreatedBy(Long createdBy);

}
