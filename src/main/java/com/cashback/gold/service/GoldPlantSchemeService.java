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
        return repository.save(scheme);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

