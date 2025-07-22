package com.cashback.gold.service;

import com.cashback.gold.dto.InventoryRequest;
import com.cashback.gold.dto.InventoryResponse;
import com.cashback.gold.entity.Inventory;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.InventoryRepository;
import com.cashback.gold.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import com.cashback.gold.security.UserPrincipal;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository repository;
    private final UserRepository userRepository;

    public InventoryResponse getInventory(UserPrincipal currentUser) {
        Inventory inv = repository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new InvalidArgumentException("Inventory not found for user."));
        return map(inv);
    }

    public InventoryResponse updateInventory(InventoryRequest request, UserPrincipal currentUser) {
        Inventory inv = repository.findByUserId(currentUser.getId()).orElse(new Inventory());
        inv.setTotalStock(request.getTotalStock());
        inv.setInStoreStock(request.getInStoreStock());
        inv.setGoldStock(request.getGoldStock());
        inv.setSilverStock(request.getSilverStock());
        inv.setDiamondStock(request.getDiamondStock());
        inv.setUnit(request.getUnit());
        inv.setUpdatedAt(LocalDateTime.now());

        // Set the associated user (minimal reference)
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new InvalidArgumentException("User not found."));
        inv.setUser(user);

        repository.save(inv);
        return map(inv);
    }

    private InventoryResponse map(Inventory inv) {
        return InventoryResponse.builder()
                .totalStock(inv.getTotalStock())
                .inStoreStock(inv.getInStoreStock())
                .goldStock(inv.getGoldStock())
                .silverStock(inv.getSilverStock())
                .diamondStock(inv.getDiamondStock())
                .unit(inv.getUnit())
                .updatedAt(inv.getUpdatedAt())
                .build();
    }
}

