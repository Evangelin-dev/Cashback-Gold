package com.cashback.gold.scheduler;

import com.cashback.gold.entity.UserSavingEnrollment;
import com.cashback.gold.entity.UserSavingPayment;
import com.cashback.gold.repository.UserSavingEnrollmentRepository;
import com.cashback.gold.repository.UserSavingPaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SavingPlanSchedulerService {

    private final UserSavingEnrollmentRepository enrollRepo;
    private final UserSavingPaymentRepository paymentRepo;

    @Scheduled(cron = "0 0 1 * * *") // daily at 1 AM
    public void checkDelayedPaymentsAndExtend() {
        List<UserSavingEnrollment> activeEnrollments = enrollRepo.findAll().stream()
                .filter(e -> e.getStatus() == UserSavingEnrollment.EnrollmentStatus.ENROLLED)
                .toList();

        for (UserSavingEnrollment enrollment : activeEnrollments) {
            LocalDate now = LocalDate.now();
            long monthsPassed = ChronoUnit.MONTHS.between(
                    enrollment.getStartDate().withDayOfMonth(1),
                    now.withDayOfMonth(1)
            );

            int expectedMonth = (int) monthsPassed + 1;
            List<UserSavingPayment> payments = paymentRepo.findByEnrollment(enrollment);
            boolean alreadyPaid = payments.stream().anyMatch(p -> p.getMonth() == expectedMonth);

            if (!alreadyPaid && now.getDayOfMonth() > 5) {
                log.info("Payment not done for month " + expectedMonth + ", extending scheme for user " + enrollment.getUser().getId());
                int extra = enrollment.getExtraMonths() == null ? 0 : enrollment.getExtraMonths();
                enrollment.setExtraMonths(extra + 1);
                enrollRepo.save(enrollment);

                // TODO: Notify user via email/WhatsApp here
            }
        }
    }

}
