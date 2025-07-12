package com.cashback.gold.service;

import com.cashback.gold.dto.common.ApiResponse;
import com.cashback.gold.dto.WalletBalanceResponse;
import com.cashback.gold.dto.WalletTopupRequest;
import com.cashback.gold.dto.WalletTransactionResponse;
import com.cashback.gold.entity.User;
import com.cashback.gold.entity.Wallet;
import com.cashback.gold.entity.WalletTransaction;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.repository.WalletRepository;
import com.cashback.gold.repository.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    private static final String[] ALLOWED_PAYMENT_METHODS = {"UPI", "GOOGLE_PAY", "PAYTM"};

    public WalletBalanceResponse getWalletBalance() {
        User user = getCurrentUser();
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new InvalidArgumentException("Wallet not found"));

        return WalletBalanceResponse.builder()
                .balance(wallet.getBalance())
                .creditLimit(wallet.getCreditLimit())
                .usedCredit(wallet.getUsedCredit())
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    @Transactional
    public ApiResponse topupWallet(WalletTopupRequest request) {
        validateTopupRequest(request);
        User user = getCurrentUser();
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseGet(() -> createNewWallet(user));

        // Simulate payment processing
        BigDecimal amount = request.getAmount();
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);

        WalletTransaction transaction = WalletTransaction.builder()
                .wallet(wallet)
                .type("TOPUP")
                .amount(amount)
                .paymentMethod(request.getPaymentMethod())
                .status("COMPLETED")
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(transaction);

        return new ApiResponse(true, "Wallet topped up successfully");
    }

    public Page<WalletTransactionResponse> getTransactionHistory(Pageable pageable) {
        User user = getCurrentUser();
        return transactionRepository.findByWalletUserId(user.getId(), pageable)
                .map(tx -> WalletTransactionResponse.builder()
                        .id(tx.getId())
                        .date(tx.getCreatedAt().toLocalDate().toString())
                        .type(tx.getType())
                        .amount((tx.getType().equals("TOPUP") ? "+" : "-") + "₹" + tx.getAmount())
                        .status(tx.getStatus())
                        .color(tx.getType().equals("TOPUP") ? "text-green-600" : "text-red-600")
                        .build()
                );
    }

    public ApiResponse requestCreditLimitIncrease() {
        User user = getCurrentUser();
        walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new InvalidArgumentException("Wallet not found"));

        // Placeholder: In a real system, this would trigger an admin review process
        return new ApiResponse(true, "Credit limit increase request submitted");
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidArgumentException("User not found"));
    }

    private void validateTopupRequest(WalletTopupRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidArgumentException("Amount must be positive");
        }
        if (request.getPaymentMethod() == null || !isValidPaymentMethod(request.getPaymentMethod())) {
            throw new InvalidArgumentException("Invalid payment method");
        }
    }

    private boolean isValidPaymentMethod(String method) {
        for (String allowed : ALLOWED_PAYMENT_METHODS) {
            if (allowed.equals(method)) {
                return true;
            }
        }
        return false;
    }

    private Wallet createNewWallet(User user) {
        Wallet wallet = Wallet.builder()
                .user(user)
                .balance(BigDecimal.ZERO)
                .creditLimit(BigDecimal.ZERO)
                .usedCredit(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return walletRepository.save(wallet);
    }
}
