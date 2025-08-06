package com.cashback.gold.service;

import com.cashback.gold.dto.AccountSummaryResponse;
import com.cashback.gold.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdminSummaryService {

    private final UserRepository userRepository;
    private final CommissionRepository commissionRepository;

    // Use ONE of the following:
    // private final SaleRepository saleRepository;           // if using Sale
    // private final OrderItemRepository orderItemRepository; // if using Order/OrderItem

    public AccountSummaryResponse getSummary() {

        long totalUsers = userRepository.count();
        long partners   = userRepository.countByRole("PARTNER");

        // ---- Commission (only APPROVED) ----
        BigDecimal approvedCommission = nzd(commissionRepository.sumByStatus("APPROVED"));

        // ---- Gold sold (COMPLETED orders) ----
        Double goldSoldGrams = 0d;
        Long b2bVendors = 0L;

        // If using SaleRepository:
        // goldSoldGrams = nn(saleRepository.sumGoldSoldGramsCompleted());
        // b2bVendors    = nnl(saleRepository.countDistinctB2bVendors());

        // If using OrderItemRepository:
        // goldSoldGrams = nn(orderItemRepository.sumGoldSoldGramsCompleted());
        // b2bVendors    = nnl(orderItemRepository.countDistinctB2bVendors());

        // ---- Formatters ----
        String commissionDisplay = formatInr(approvedCommission);
        String goldDisplay       = formatWeight(goldSoldGrams);

        return AccountSummaryResponse.builder()
                .totalUsers(totalUsers)
                .partners(partners)
                .goldSoldGrams(goldSoldGrams)
                .goldSoldDisplay(goldDisplay)
                .commissionEarnedInr(approvedCommission.longValue())
                .commissionEarnedDisplay(commissionDisplay)
                .b2bVendors(b2bVendors)
                .build();
    }

    // ---------- helpers ----------
    private static BigDecimal nzd(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }
    private static Double nn(Double v) { return v == null ? 0d : v; }
    private static Long nnl(Long v) { return v == null ? 0L : v; }

    private static String formatInr(BigDecimal amount) {
        NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        nf.setMaximumFractionDigits(0);
        return nf.format(amount);
    }

    // 3200g -> "3.2kg", 950g -> "950g"
    private static String formatWeight(Double grams) {
        if (grams == null) grams = 0d;
        if (grams >= 1000d) {
            double kg = grams / 1000d;
            return String.format("%.1fkg", kg);
        }
        return String.format("%.0fg", grams);
    }
}
