package com.cashback.gold.service;

import com.cashback.gold.entity.Commission;
import com.cashback.gold.entity.PayoutRequest;
import com.cashback.gold.entity.User;
import com.cashback.gold.repository.CommissionRepository;
import com.cashback.gold.repository.PayoutRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import jakarta.persistence.criteria.Join;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartnerCommissionService {

    private final CommissionRepository commissionRepository;
    private final PayoutRequestRepository payoutRequestRepository;

    public List<Commission> getMyEarnings(Long partnerId) {
        return commissionRepository.findByPartnerId(partnerId);
    }

    public Map<String, Object> getApprovedEarnings(Long partnerId) {
        // 1. Total approved commission earned
        double approvedCommission = commissionRepository.findByPartnerIdAndStatus(partnerId, "Approved")
                .stream()
                .mapToDouble(Commission::getCommissionAmount)
                .sum();

        // 2. Total payout already paid by admin
        double paidPayouts = payoutRequestRepository.findByPartnerIdOrderByRequestedAtDesc(partnerId).stream()
                .filter(p -> "Paid".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(PayoutRequest::getAmount)
                .sum();

        // 3. Total payout currently requested but not paid yet
        double pendingPayouts = payoutRequestRepository.findByPartnerIdOrderByRequestedAtDesc(partnerId).stream()
                .filter(p -> "Pending".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(PayoutRequest::getAmount)
                .sum();

        // 4. Available earnings = totalApproved - paid
        double totalEarnings = approvedCommission - paidPayouts;

        // 5. Withdrawable = totalEarnings - pending requests
        double withdrawalBalance = totalEarnings - pendingPayouts;

        // Never allow negative values
        if (withdrawalBalance < 0) withdrawalBalance = 0;

        Map<String, Object> result = new HashMap<>();
        result.put("totalEarnings", totalEarnings);
        result.put("withdrawalBalance", withdrawalBalance);
        result.put("alreadyRequested", pendingPayouts);
        return result;
    }

    public Map<String, Object> getCommissionsForAdmin(int page, int size, String type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Specification<Commission> spec = (root, query, cb) -> {
            if (!"all".equalsIgnoreCase(type)) {
                Join<Commission, User> partnerJoin = root.join("partner");
                return cb.equal(cb.upper(partnerJoin.get("role")), type.toUpperCase());
            }
            return cb.conjunction();
        };

        Page<Commission> result = commissionRepository.findAll(spec, pageable);

        return Map.of(
                "content", result.getContent(),
                "totalPages", result.getTotalPages(),
                "currentPage", result.getNumber(),
                "totalElements", result.getTotalElements()
        );
    }


    public void updateCommissionStatus(Long id, String status) {
        Commission c = commissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        c.setStatus(status);
        commissionRepository.save(c);
    }

    public void deleteCommission(Long id) {
        commissionRepository.deleteById(id);
    }

}
