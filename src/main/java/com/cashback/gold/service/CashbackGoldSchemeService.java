package com.cashback.gold.service;

import com.cashback.gold.dto.CashbackGoldSchemeRequest;
import com.cashback.gold.entity.CashbackGoldScheme;
import com.cashback.gold.entity.UserCashbackGoldEnrollment;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.CashbackGoldSchemeRepository;
import com.cashback.gold.repository.UserCashbackGoldEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CashbackGoldSchemeService {

    private final CashbackGoldSchemeRepository repository;
    private final UserCashbackGoldEnrollmentRepository userCashbackGoldEnrollmentRepository;

    public List<CashbackGoldScheme> getAll() {
        return repository.findAll();
    }

    public CashbackGoldScheme create(CashbackGoldSchemeRequest req) {
        CashbackGoldScheme scheme = CashbackGoldScheme.builder()
                .name(req.getName())
                .duration(req.getDuration())
                .minInvest(req.getMinInvest())
                .status(req.getStatus())
                .description(req.getDescription())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .keyPoint1(req.getKeyPoint1())
                .keyPoint2(req.getKeyPoint2())
                .keyPoint3(req.getKeyPoint3())
                .build();
        return repository.save(scheme);
    }

    public CashbackGoldScheme update(Long id, CashbackGoldSchemeRequest req) {
        CashbackGoldScheme scheme = repository.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Scheme not found"));
        scheme.setName(req.getName());
        scheme.setDuration(req.getDuration());
        scheme.setMinInvest(req.getMinInvest());
        scheme.setStatus(req.getStatus());
        scheme.setDescription(req.getDescription());
        scheme.setUpdatedAt(LocalDateTime.now());
        scheme.setKeyPoint1(req.getKeyPoint1());
        scheme.setKeyPoint2(req.getKeyPoint2());
        scheme.setKeyPoint3(req.getKeyPoint3());
        return repository.save(scheme);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public void changeStatus(Long id, String status) {
        CashbackGoldScheme scheme = repository.findById(id)
                .orElseThrow(() -> new InvalidArgumentException("Cashback Gold Scheme not found"));
        scheme.setStatus(status.toUpperCase());
        repository.save(scheme);
    }

    public List<UserCashbackGoldEnrollment> getWithdrawnEnrollments() {
        return userCashbackGoldEnrollmentRepository.findByStatus("WITHDRAWN");
    }
}