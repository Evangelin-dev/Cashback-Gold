package com.cashback.gold.controller;

import com.cashback.gold.dto.SupportTicketRequest;
import com.cashback.gold.dto.SupportTicketResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.SupportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/b2b/support")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<SupportTicketResponse> raiseTicket(
            @RequestBody SupportTicketRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long userId = userPrincipal.getId();
        return ResponseEntity.ok(supportService.createTicket(userId, request));
    }

    @GetMapping("/admin/support-tickets")
    public ResponseEntity<Page<SupportTicketResponse>> getAllTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(supportService.getAllTickets(status, page, size));
    }

    @GetMapping("/admin/support-tickets/{id}")
    public ResponseEntity<SupportTicketResponse> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(supportService.getTicketById(id));
    }

    @PutMapping("/admin/support-tickets/{id}/status")
    public ResponseEntity<SupportTicketResponse> updateTicketStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(supportService.updateTicketStatus(id, status));
    }

}
