package com.cashback.gold.repository;

import com.cashback.gold.entity.ContactMessage;
import com.cashback.gold.enums.ContactStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    Page<ContactMessage> findByStatus(ContactStatus status, Pageable pageable);
    Page<ContactMessage> findByEmailContainingIgnoreCase(String email, Pageable pageable);
    Page<ContactMessage> findByPhoneContaining(String phone, Pageable pageable);
}
