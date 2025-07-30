package com.cashback.gold.scheduler;

import com.cashback.gold.entity.UserGoldPlantEnrollment;
import com.cashback.gold.repository.UserGoldPlantEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class GoldPlantMonthlyYieldJob {

    private final UserGoldPlantEnrollmentRepository enrollmentRepo;

    // Run every month at 2AM on 1st
    @Scheduled(cron = "0 0 2 1 * *") // adjust as per prod need
    public void addMonthlyYieldToUsers() {
        log.info("▶ Running monthly gold yield job for Gold Plant Scheme...");

        List<UserGoldPlantEnrollment> activeEnrollments = enrollmentRepo.findAll().stream()
                .filter(e -> e.getStatus().equalsIgnoreCase("ENROLLED"))
                .toList();

        for (UserGoldPlantEnrollment e : activeEnrollments) {
            // 1% of invested amount
            BigDecimal yield = e.getAmountInvested()
                    .multiply(BigDecimal.valueOf(0.01));

            e.setGoldYieldAccumulated(e.getGoldYieldAccumulated().add(yield));

            // Lockin completed if 3 years over
            long months = ChronoUnit.MONTHS.between(e.getStartDate(), LocalDate.now());
            if (months >= 36 && !e.isLockinCompleted()) {
                e.setLockinCompleted(true);
                log.info("🔓 Lock-in completed for enrollment ID: {}", e.getId());
            }

            enrollmentRepo.save(e);
            log.info("✅ Added 1% yield ₹{} for enrollment ID: {}", yield.setScale(2, RoundingMode.HALF_UP), e.getId());
        }

        log.info("✅ Gold Yield job completed.");
    }
}

