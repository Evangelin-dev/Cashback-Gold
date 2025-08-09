package com.cashback.gold.controller;

import com.cashback.gold.entity.BankAccount;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.BankAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank-accounts")
@RequiredArgsConstructor
@Tag(name = "Bank Account Controller", description = "Manage user's bank accounts")
public class BankAccountController {

    private final BankAccountService service;

    @Operation(summary = "Get all bank accounts of the logged-in user")
    @ApiResponse(responseCode = "200", description = "Bank accounts fetched successfully")
    @GetMapping
    public ResponseEntity<List<BankAccount>> getMyAccounts(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(service.getMyAccounts(userPrincipal.getId()));
    }

    @Operation(summary = "Add or update a bank account")
    @ApiResponse(responseCode = "200", description = "Bank account saved successfully")
    @PostMapping
    public ResponseEntity<BankAccount> save(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody BankAccount account
    ) {
        return ResponseEntity.ok(service.addOrUpdate(userPrincipal.getId(), account));
    }

    @Operation(summary = "Toggle bank account status")
    @ApiResponse(responseCode = "200", description = "Bank account status toggled successfully")
    @PutMapping("/{id}/toggle")
    public ResponseEntity<BankAccount> toggleStatus(
            @Parameter(description = "Bank account ID") @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(service.toggleStatus(id, userPrincipal.getId()));
    }

    @Operation(summary = "Delete a bank account")
    @ApiResponse(responseCode = "204", description = "Bank account deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "Bank account ID") @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        service.delete(id, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
