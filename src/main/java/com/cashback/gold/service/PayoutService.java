package com.cashback.gold.service;

import com.cashback.gold.dto.PayoutDTO;
import com.cashback.gold.dto.PayoutRequestDto;
import com.cashback.gold.dto.PayoutResponseDTO;
import com.cashback.gold.entity.BankAccount;
import com.cashback.gold.entity.PayoutRequest;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.BankAccountRepository;
import com.cashback.gold.repository.CommissionRepository;
import com.cashback.gold.repository.PayoutRequestRepository;
import jakarta.persistence.criteria.Join;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayoutService {
    private final PayoutRequestRepository payoutRepo;
    private final CommissionRepository commissionRepo;
    private final BankAccountRepository bankAccountRepository;

    public void requestPayout(Long partnerId, PayoutRequestDto dto) {
        if (dto.getAmount() < 1000) throw new InvalidArgumentException("Minimum payout is ₹1,000");

        Double approvedCommission = commissionRepo.getApprovedCommissionSumByPartnerId(partnerId);
        Double alreadyRequested = payoutRepo.findByPartnerIdOrderByRequestedAtDesc(partnerId).stream()
                .filter(p -> !"Rejected".equalsIgnoreCase(p.getStatus()))
                .mapToDouble(PayoutRequest::getAmount)
                .sum();

        double withdrawable = approvedCommission - alreadyRequested;
        if (dto.getAmount() > withdrawable) {
            throw new InvalidArgumentException("Insufficient withdrawal balance");
        }

        // 🔍 Fetch Bank Account
        BankAccount bankAccount = bankAccountRepository.findByUserId(partnerId).stream()
                .filter(a -> "ACTIVE".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .orElseThrow(() -> new InvalidArgumentException("No active bank account found"));


        String methodDetail = switch (dto.getMethod().toUpperCase()) {
            case "UPI" -> bankAccount.getUpiId();
            case "BANK" -> bankAccount.getAccount() + " | IFSC: " + bankAccount.getIfsc();
            default -> throw new InvalidArgumentException("Invalid method: " + dto.getMethod());
        };

        payoutRepo.save(PayoutRequest.builder()
                .partnerId(partnerId)
                .amount(dto.getAmount())
                .method(dto.getMethod())
                .methodDetail(methodDetail)
                .status("Pending")
                .build());
    }
    public List<PayoutDTO> getPartnerPayoutHistory(Long partnerId) {
        List<PayoutRequest> requests = payoutRepo.findByPartnerIdOrderByRequestedAtDesc(partnerId);

        return requests.stream().map(req -> {
            User partner = req.getPartner();
            return PayoutDTO.builder()
                    .id(req.getId())
                    .amount(req.getAmount())
                    .method(req.getMethod())
                    .methodDetail(req.getMethodDetail())
                    .status(req.getStatus())
                    .requestedAt(req.getRequestedAt())
                    .partnerName(partner != null ? partner.getFullName() : null)
                    .partnerRole(partner != null ? partner.getRole() : null)
                    .build();
        }).toList();
    }


    public BankAccount getActiveAccount(Long userId) {
        return bankAccountRepository.findByUserId(userId).stream()
                .filter(a -> "ACTIVE".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .orElseThrow(() -> new InvalidArgumentException("No active bank account found"));
    }

    public Map<String, Object> getAllPayouts(int page, int size, String userType) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestedAt").descending());

        Specification<PayoutRequest> spec = (root, query, cb) -> {
            if (userType != null && !userType.equalsIgnoreCase("All")) {
                Join<PayoutRequest, User> userJoin = root.join("partner");
                return cb.equal(cb.upper(userJoin.get("role")), userType.toUpperCase());
            }
            return cb.conjunction();
        };

        Page<PayoutRequest> result = payoutRepo.findAll(spec, pageable);

        List<PayoutResponseDTO> responseList = result.getContent().stream().map(payout -> {
            User partner = payout.getPartner();  // fetched via @ManyToOne
            return PayoutResponseDTO.builder()
                    .id(payout.getId())
                    .partnerId(payout.getPartnerId())
                    .partnerName(partner != null ? partner.getFullName() : null)
                    .partnerRole(partner != null ? partner.getRole() : null)
                    .amount(payout.getAmount())
                    .method(payout.getMethod())
                    .methodDetail(payout.getMethodDetail())
                    .status(payout.getStatus())
                    .requestedAt(payout.getRequestedAt())
                    .build();
        }).toList();

        return Map.of(
                "content", responseList,
                "totalPages", result.getTotalPages(),
                "currentPage", result.getNumber(),
                "totalElements", result.getTotalElements()
        );
    }


    @Transactional
    public void updatePayoutStatus(Long id, String status) {
        PayoutRequest request = payoutRepo.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Payout not found"));

        if (!List.of("Paid", "Rejected").contains(status)) {
            throw new InvalidArgumentException("Invalid status: " + status);
        }

        request.setStatus(status);
        payoutRepo.save(request);
    }


}

