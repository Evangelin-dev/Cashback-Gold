package com.cashback.gold.controller;

import com.cashback.gold.dto.SipRequest;
import com.cashback.gold.entity.Sip;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.SipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sips")
public class SipController {
    @Autowired
    private SipService sipService;

    @PostMapping
    public ResponseEntity<Sip> createSip(@RequestBody SipRequest request,
                                         @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long b2bUserId = userPrincipal.getId();
        return ResponseEntity.ok(sipService.createSip(request,b2bUserId));
    }

    @PutMapping("/{sipId}")
    public ResponseEntity<Sip> updateSip(@PathVariable Long sipId, @RequestBody SipRequest request) {
        return ResponseEntity.ok(sipService.updateSip(sipId, request));
    }

    @GetMapping
    public ResponseEntity<List<Sip>> getAllSips() {
        return ResponseEntity.ok(sipService.getAllSips());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Sip>> searchSips(@RequestParam String query) {
        return ResponseEntity.ok(sipService.searchSips(query));
    }

    @PatchMapping("/{sipId}/status")
    public ResponseEntity<Sip> changeSipStatus(@PathVariable Long sipId, @RequestBody String status) {
        return ResponseEntity.ok(sipService.changeSipStatus(sipId, status));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Sip>> getMySips(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal.getId();  // Get logged-in user ID
        return ResponseEntity.ok(sipService.getSipsForUser(userId));
    }

    @GetMapping("/b2b/mine")
    public ResponseEntity<List<Sip>> getSipsCreatedByMe(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long b2bUserId = userPrincipal.getId();
        return ResponseEntity.ok(sipService.getSipsCreatedByB2BUser(b2bUserId));
    }

}
