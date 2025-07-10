package com.cashback.gold.repository;

import com.cashback.gold.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;

import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByIdentifierAndVerifiedFalse(String identifier);
    Optional<OtpVerification> findTopByIdentifierOrderByIdDesc(String identifier);
    Optional<OtpVerification> findTopByIdentifierAndVerifiedFalseOrderByIdDesc(String identifier);

    @Query("SELECT COUNT(o) FROM OtpVerification o WHERE o.identifier = :identifier AND o.createdAt > :since")
    long countRecentOtps(@Param("identifier") String identifier, @Param("since") LocalDateTime since);

}
