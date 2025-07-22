package com.cashback.gold.controller;

import com.cashback.gold.entity.BankAccount;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.BankAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
@RequiredArgsConstructor
public class BankAccountController {

    private final BankAccountService service;

    @GetMapping
    public ResponseEntity<List<BankAccount>> getMyAccounts(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.getMyAccounts(userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<BankAccount> save(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                            @RequestBody BankAccount account) {
        return ResponseEntity.ok(service.addOrUpdate(userPrincipal.getId(), account));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<BankAccount> toggleStatus(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(service.toggleStatus(id, userPrincipal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        service.delete(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}


