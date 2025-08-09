package com.cashback.gold.controller;

import com.cashback.gold.dto.ContactCreateRequest;
import com.cashback.gold.dto.ContactResponse;
import com.cashback.gold.dto.ContactStatusUpdateRequest;
import com.cashback.gold.enums.ContactStatus;
import com.cashback.gold.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Contact Controller", description = "Public and Admin APIs for managing contact messages")
public class ContactController {

    private final ContactService service;

    @Operation(summary = "Create a new contact message (Public)")
    @ApiResponse(responseCode = "200", description = "Contact message created successfully")
    @PostMapping("/api/contact")
    public ResponseEntity<ContactResponse> create(
            @Valid @RequestBody ContactCreateRequest req
    ) {
        return ResponseEntity.ok(service.create(req));
    }

    @Operation(summary = "List contact messages with filters and pagination (Admin)")
    @ApiResponse(responseCode = "200", description = "Contact list fetched successfully")
    @GetMapping("/admin/contacts")
    public ResponseEntity<Page<ContactResponse>> list(
            @Parameter(description = "Filter by status") @RequestParam(required = false) ContactStatus status,
            @Parameter(description = "Filter by email") @RequestParam(required = false) String email,
            @Parameter(description = "Filter by phone") @RequestParam(required = false) String phone,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort format: field,ASC|DESC") @RequestParam(defaultValue = "createdAt,DESC") String sort
    ) {
        String[] s = sort.split(",");
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.fromString(s.length > 1 ? s[1] : "DESC"), s[0])
        );
        return ResponseEntity.ok(service.list(status, email, phone, pageable));
    }

    @Operation(summary = "Get a contact message by ID (Admin)")
    @ApiResponse(responseCode = "200", description = "Contact message fetched successfully")
    @GetMapping("/admin/contacts/{id}")
    public ResponseEntity<ContactResponse> get(
            @Parameter(description = "Contact ID") @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.get(id));
    }

    @Operation(summary = "Update contact message status (Admin)")
    @ApiResponse(responseCode = "200", description = "Contact status updated successfully")
    @PatchMapping("/admin/contacts/{id}/status")
    public ResponseEntity<ContactResponse> updateStatus(
            @Parameter(description = "Contact ID") @PathVariable Long id,
            @Valid @RequestBody ContactStatusUpdateRequest req
    ) {
        return ResponseEntity.ok(service.updateStatus(id, req.getStatus()));
    }

    @Operation(summary = "Delete a contact message (Admin)")
    @ApiResponse(responseCode = "204", description = "Contact message deleted successfully")
    @DeleteMapping("/admin/contacts/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "Contact ID") @PathVariable Long id
    ) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
