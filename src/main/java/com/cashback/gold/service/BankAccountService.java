package com.cashback.gold.service;

import com.cashback.gold.entity.BankAccount;
import com.cashback.gold.repository.BankAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BankAccountService {

    private final BankAccountRepository repository;

    public List<BankAccount> getMyAccounts(Long userId) {
        return repository.findByUserId(userId);
    }

    public BankAccount addOrUpdate(Long userId, BankAccount account) {
        account.setUserId(userId);
        return repository.save(account);
    }

    public void delete(Long id, Long userId) {
        BankAccount acc = repository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));
        repository.delete(acc);
    }

    public BankAccount toggleStatus(Long id, Long userId) {
        BankAccount acc = repository.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Account not found or unauthorized"));
        acc.setStatus(acc.getStatus().equals("ACTIVE") ? "INACTIVE" : "ACTIVE");
        return repository.save(acc);
    }
}

