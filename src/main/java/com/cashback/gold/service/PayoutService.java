package com.cashback.gold.service;

import com.cashback.gold.dto.PayoutRequestDto;
import com.cashback.gold.entity.BankAccount;
import com.cashback.gold.entity.PayoutRequest;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.BankAccountRepository;
import com.cashback.gold.repository.CommissionRepository;
import com.cashback.gold.repository.PayoutRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
    public List<PayoutRequest> getPartnerPayoutHistory(Long partnerId) {
        return payoutRepo.findByPartnerIdOrderByRequestedAtDesc(partnerId);
    }

    public BankAccount getActiveAccount(Long userId) {
        return bankAccountRepository.findByUserId(userId).stream()
                .filter(a -> "ACTIVE".equalsIgnoreCase(a.getStatus()))
                .findFirst()
                .orElseThrow(() -> new InvalidArgumentException("No active bank account found"));
    }


}

