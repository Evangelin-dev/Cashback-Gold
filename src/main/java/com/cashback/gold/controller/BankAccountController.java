package com.cashback.gold.controller;

import com.cashback.gold.entity.BankAccount;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
@RequiredArgsConstructor
public class BankAccountController {

    private final BankAccountService service;

    private Long getUserId() {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userPrincipal.getId();
    }


    @GetMapping
    public ResponseEntity<List<BankAccount>> getMyAccounts() {
        return ResponseEntity.ok(service.getMyAccounts(getUserId()));
    }

    @PostMapping
    public ResponseEntity<BankAccount> save(@RequestBody BankAccount account) {
        return ResponseEntity.ok(service.addOrUpdate(getUserId(), account));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<BankAccount> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleStatus(id, getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id, getUserId());
        return ResponseEntity.noContent().build();
    }
}

