package com.cashback.gold.service;

import com.cashback.gold.dto.InventoryRequest;
import com.cashback.gold.dto.InventoryResponse;
import com.cashback.gold.entity.Inventory;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository repository;

    public InventoryResponse getInventory() {
        Inventory inv = repository.findAll().stream().findFirst()
                .orElseThrow(() -> new InvalidArgumentException("Inventory not initialized."));
        return map(inv);
    }

    public InventoryResponse updateInventory(InventoryRequest request) {
        Inventory inv = repository.findAll().stream().findFirst().orElse(new Inventory());
        inv.setTotalStock(request.getTotalStock());
        inv.setInStoreStock(request.getInStoreStock());
        inv.setGoldStock(request.getGoldStock());
        inv.setSilverStock(request.getSilverStock());
        inv.setDiamondStock(request.getDiamondStock());
        inv.setUnit(request.getUnit());
        inv.setUpdatedAt(LocalDateTime.now());
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

