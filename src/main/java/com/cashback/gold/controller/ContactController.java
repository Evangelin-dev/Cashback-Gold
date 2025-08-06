package com.cashback.gold.controller;

import com.cashback.gold.dto.ContactCreateRequest;
import com.cashback.gold.dto.ContactResponse;
import com.cashback.gold.dto.ContactStatusUpdateRequest;
import com.cashback.gold.enums.ContactStatus;
import com.cashback.gold.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ContactController {

    private final ContactService service;

    /** Public endpoint to create a contact message */
    @PostMapping("/api/contact")
    public ResponseEntity<ContactResponse> create(@Valid @RequestBody ContactCreateRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    /** Admin: list with filters & pagination */
    @GetMapping("/admin/contacts")
    public ResponseEntity<Page<ContactResponse>> list(
            @RequestParam(required = false) ContactStatus status,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        String[] s = sort.split(",");
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(s.length > 1 ? s[1] : "DESC"), s[0])
        );
        return ResponseEntity.ok(service.list(status, email, phone, pageable));
    }

    /** Admin: get by id */
    @GetMapping("/admin/contacts/{id}")
    public ResponseEntity<ContactResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }

    /** Admin: update status */
    @PatchMapping("/admin/contacts/{id}/status")
    public ResponseEntity<ContactResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ContactStatusUpdateRequest req
    ) {
        return ResponseEntity.ok(service.updateStatus(id, req.getStatus()));
    }

    /** Admin: delete */
    @DeleteMapping("/admin/contacts/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
