package com.cashback.gold.service;

import com.cashback.gold.dto.AchievementDTO;
import com.cashback.gold.dto.KpiDTO;
import com.cashback.gold.dto.PartnerDashboardResponse;
import com.cashback.gold.dto.QuickStatDTO;
import com.cashback.gold.repository.*;
import com.cashback.gold.security.UserPrincipal; // your auth principal
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PartnerDashboardService {

    private final CommissionRepository commissionRepository;
    private final PayoutRequestRepository payoutRequestRepository;
    private final UserRepository userRepository;

    // ---- Status constants (Strings) ----
    private static final String STATUS_PENDING  = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    // If you later add "PAID", add it here and into logic where relevant.

    public PartnerDashboardResponse getDashboard(UserPrincipal principal) {
        Long partnerId = principal.getId();

        // --- Approved commissions total ---
        BigDecimal approvedCommissions = nz(
                commissionRepository.sumByPartnerAndStatus(partnerId, STATUS_APPROVED)
        );

        // --- Payouts already approved/paid (if you only have APPROVED/REJECTED, then include only APPROVED) ---
        BigDecimal approvedPayouts = nz(
                payoutRequestRepository.sumByPartnerAndStatuses(
                        partnerId,
                        List.of(STATUS_APPROVED) // add "PAID" here if you later introduce it
                )
        );

        // --- Available balance = approved commissions - approved/paid payouts ---
        BigDecimal availableBalance = approvedCommissions.subtract(approvedPayouts);
        if (availableBalance.signum() < 0) availableBalance = BigDecimal.ZERO;

        // --- Referral stats ---
        long totalReferrals  = userRepository.countByReferredBy(partnerId);
        long activeReferrals = userRepository.countByReferredByAndStatus(partnerId, STATUS_APPROVED);

        // --- Commission entry count (optional) ---
        long totalCommissionsCount = commissionRepository.countByPartnerId(partnerId);

        // --- Pending payout count ---
        long pendingPayouts = payoutRequestRepository.countByPartnerIdAndStatus(partnerId, STATUS_PENDING);

        // --- MoM trend on APPROVED commissions (amount) ---
        var now = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        var startOfThisMonth = now.with(TemporalAdjusters.firstDayOfMonth()).toLocalDate().atStartOfDay();
        var endOfThisMonth   = now.with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX).toLocalDateTime();
        var startOfLastMonth = now.minusMonths(1).with(TemporalAdjusters.firstDayOfMonth()).toLocalDate().atStartOfDay();
        var endOfLastMonth   = now.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth()).with(LocalTime.MAX).toLocalDateTime();

        BigDecimal thisMonthAmt = nz(commissionRepository.sumByPartnerAndStatusBetween(
                partnerId, STATUS_APPROVED, startOfThisMonth, endOfThisMonth
        ));
        BigDecimal lastMonthAmt = nz(commissionRepository.sumByPartnerAndStatusBetween(
                partnerId, STATUS_APPROVED, startOfLastMonth, endOfLastMonth
        ));
        String trend = calcTrend(lastMonthAmt, thisMonthAmt);

        // --- Map to response DTOs used by your React UI ---
        var quickStats = List.of(
                QuickStatDTO.builder().label("Total Referrals").value(String.valueOf(totalReferrals)).icon("fas fa-user-friends").build(),
                QuickStatDTO.builder().label("Active Referrals").value(String.valueOf(activeReferrals)).icon("fas fa-user-check").build(),
                QuickStatDTO.builder().label("Pending Payouts").value(String.valueOf(pendingPayouts)).icon("fas fa-hand-holding-usd").build()
        );

        var kpis = List.of(
                KpiDTO.builder()
                        .label("Total Commission (Approved)")
                        .value(fmtInr(approvedCommissions))
                        .trend(trend)
                        .icon("fas fa-chart-line")
                        .color("from-rose-50 to-rose-100/70")
                        .borderColor("border-rose-200/70")
                        .build(),
                KpiDTO.builder()
                        .label("Total Commission Entries")
                        .value(String.valueOf(totalCommissionsCount))
                        .trend(trend)
                        .icon("fas fa-receipt")
                        .color("from-amber-50 to-amber-100/70")
                        .borderColor("border-amber-200/70")
                        .build(),
                KpiDTO.builder()
                        .label("Active Referrals")
                        .value(String.valueOf(activeReferrals))
                        .trend(activeReferrals > 0 ? "+1%" : "0%") // simple placeholder
                        .icon("fas fa-users")
                        .color("from-sky-50 to-sky-100/70")
                        .borderColor("border-sky-200/70")
                        .build()
        );

        var achievements = List.of(
                AchievementDTO.builder().key("first_sale").title("First Sale").desc("Made your first successful referral").achieved(activeReferrals >= 1).build(),
                AchievementDTO.builder().key("rising_star").title("Rising Star").desc("Earned ₹10,000+ in commissions").achieved(approvedCommissions.compareTo(new BigDecimal("10000")) >= 0).build(),
                AchievementDTO.builder().key("gold_master").title("Gold Master").desc("₹1,00,000+ gold purchases").achieved(false).build() // depends on your orders data
        );

        return PartnerDashboardResponse.builder()
                .quickStats(quickStats)
                .kpis(kpis)
                .availableBalance(fmtInr(availableBalance))
                .achievements(achievements)
                .build();
    }

    // -------- helpers --------
    private static BigDecimal nz(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }

    private static String fmtInr(BigDecimal v) {
        var nf = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        nf.setMaximumFractionDigits(0);
        return nf.format(v);
    }

    private static String calcTrend(BigDecimal last, BigDecimal now) {
        if (last == null || last.compareTo(BigDecimal.ZERO) == 0) {
            return now.compareTo(BigDecimal.ZERO) > 0 ? "+100%" : "0%";
        }
        var diff = now.subtract(last);
        var pct = diff.multiply(BigDecimal.valueOf(100)).divide(last, 1, BigDecimal.ROUND_HALF_UP);
        return (pct.signum() >= 0 ? "+" : "") + pct + "%";
    }
}
