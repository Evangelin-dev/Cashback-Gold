package com.cashback.gold.controller;

import com.cashback.gold.dto.NomineeRequest;
import com.cashback.gold.dto.NomineeResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.NomineeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/nominees")
@RequiredArgsConstructor
public class NomineeController {

    private final NomineeService nomineeService;

    @PostMapping
    public ResponseEntity<NomineeResponse> addNominee(@AuthenticationPrincipal UserPrincipal principal,
                                                      @RequestBody NomineeRequest request) {
        return ResponseEntity.ok(nomineeService.addNominee(principal, request));
    }

    @GetMapping
    public ResponseEntity<List<NomineeResponse>> getNominees(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(nomineeService.getNominees(principal));
    }
}
