package com.cashback.gold.service;

import com.cashback.gold.dto.GoldPlantSchemeRequest;
import com.cashback.gold.entity.GoldPlantScheme;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.GoldPlantSchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class GoldPlantSchemeService {

    private final GoldPlantSchemeRepository repository;

    public List<GoldPlantScheme> getAll() {
        return repository.findAll();
    }

    public GoldPlantScheme create(GoldPlantSchemeRequest req) {
        GoldPlantScheme scheme = GoldPlantScheme.builder()
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

    public GoldPlantScheme update(Long id, GoldPlantSchemeRequest req) {
        GoldPlantScheme scheme = repository.findById(id)
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
        GoldPlantScheme scheme = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gold Plant Scheme not found"));

        scheme.setStatus(status.toUpperCase()); // Ensures consistent status values
        repository.save(scheme);
    }

}

