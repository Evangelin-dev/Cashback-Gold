package com.cashback.gold.service;


import com.cashback.gold.dto.ContactCreateRequest;
import com.cashback.gold.dto.ContactResponse;
import com.cashback.gold.entity.ContactMessage;
import com.cashback.gold.enums.ContactStatus;
import com.cashback.gold.repository.ContactMessageRepository;
import com.cashback.gold.service.ContactService;
import com.cashback.gold.service.email.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository repo;
    private final EmailService emailService;

    private ContactResponse toDto(ContactMessage m) {
        return ContactResponse.builder()
                .id(m.getId())
                .firstName(m.getFirstName())
                .lastName(m.getLastName())
                .email(m.getEmail())
                .phone(m.getPhone())
                .message(m.getMessage())
                .status(m.getStatus())
                .createdAt(m.getCreatedAt())
                .build();
    }

    @Transactional
    public ContactResponse create(ContactCreateRequest req) {
        ContactMessage m = ContactMessage.builder()
                .firstName(req.getFirstName().trim())
                .lastName(req.getLastName().trim())
                .email(req.getEmail().trim().toLowerCase())
                .phone(req.getPhone().trim())
                .message(req.getMessage())
                .status(ContactStatus.NEW)
                .build();

        // Save to DB
        ContactMessage saved = repo.save(m);

        // Send email
        String name = saved.getFirstName() + " " + saved.getLastName();
        emailService.sendContactMessageEmail(
                saved.getEmail(), name, saved.getPhone(), saved.getMessage()
        );

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<ContactResponse> list(ContactStatus status, String email, String phone, Pageable pageable) {
        Page<ContactMessage> page;
        if (status != null) {
            page = repo.findByStatus(status, pageable);
        } else if (email != null && !email.isBlank()) {
            page = repo.findByEmailContainingIgnoreCase(email.trim(), pageable);
        } else if (phone != null && !phone.isBlank()) {
            page = repo.findByPhoneContaining(phone.trim(), pageable);
        } else {
            page = repo.findAll(pageable);
        }
        return page.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public ContactResponse get(Long id) {
        ContactMessage m = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));
        return toDto(m);
    }

    @Transactional
    public ContactResponse updateStatus(Long id, ContactStatus status) {
        ContactMessage m = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));
        m.setStatus(status);
        return toDto(repo.save(m));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Contact not found");
        repo.deleteById(id);
    }
}

