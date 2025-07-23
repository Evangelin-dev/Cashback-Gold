package com.cashback.gold.service;

import com.cashback.gold.dto.SupportTicketRequest;
import com.cashback.gold.dto.SupportTicketResponse;
import com.cashback.gold.entity.SupportTicket;
import com.cashback.gold.entity.User;
import com.cashback.gold.repository.SupportTicketRepository;
import com.cashback.gold.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportTicketRepository supportRepo;
    private final UserRepository userRepo;

    // User: Raise Ticket
    public SupportTicketResponse createTicket(Long userId, SupportTicketRequest req) {
        SupportTicket ticket = SupportTicket.builder()
                .userId(userId)
                .subject(req.getSubject())
                .message(req.getMessage())
                .status("PENDING")
                .submittedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return toResponse(supportRepo.save(ticket));
    }

    // Admin: Get All Tickets with optional status filter
    public Page<SupportTicketResponse> getAllTickets(String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submittedAt").descending());
        Page<SupportTicket> paged;

        if (status != null) {
            paged = supportRepo.findByStatus(status, pageable);
        } else {
            paged = supportRepo.findAll(pageable);
        }

        return paged.map(this::toResponse);
    }

    // Admin: Get Ticket by ID
    public SupportTicketResponse getTicketById(Long id) {
        SupportTicket ticket = supportRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Fetch the user details
        User user = userRepo.findById(ticket.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return SupportTicketResponse.builder()
                .id(ticket.getId())
                .userId(ticket.getUserId())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .status(ticket.getStatus())
                .submittedAt(ticket.getSubmittedAt())
                .email(user.getEmail()) // Include email
                .mobile(user.getMobile()) // Include mobile
                .build();
    }

    // Admin: Update Status
    public SupportTicketResponse updateTicketStatus(Long id, String status) {
        SupportTicket ticket = supportRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        return toResponse(supportRepo.save(ticket));
    }


    // Response Mapper
    private SupportTicketResponse toResponse(SupportTicket ticket) {
        return SupportTicketResponse.builder()
                .id(ticket.getId())
                .userId(ticket.getUserId())
                .subject(ticket.getSubject())
                .message(ticket.getMessage())
                .status(ticket.getStatus())
                .submittedAt(ticket.getSubmittedAt())
                .build();
    }
}
