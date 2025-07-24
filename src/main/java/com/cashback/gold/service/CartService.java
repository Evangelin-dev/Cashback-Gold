package com.cashback.gold.service;

import com.cashback.gold.entity.CartItem;
import com.cashback.gold.entity.Ornament;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.CartItemRepository;
import com.cashback.gold.repository.OrnamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartItemRepository cartRepo;
    private final OrnamentRepository ornamentRepo;

    public CartItem addToCart(Long userId, Long ornamentId, int quantity) {
        Ornament ornament = ornamentRepo.findById(ornamentId)
                .orElseThrow(() -> new InvalidArgumentException("Ornament not found"));
        return cartRepo.save(CartItem.builder()
                .userId(userId)
                .ornament(ornament)
                .quantity(quantity)
                .build());
    }

    public List<CartItem> getCart(Long userId) {
        return cartRepo.findByUserId(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepo.deleteByUserId(userId);
    }

    public void removeItemFromCart(Long cartItemId, Long userId) {
        CartItem item = cartRepo.findById(cartItemId)
                .orElseThrow(() -> new InvalidArgumentException("Cart item not found"));

        if (!item.getUserId().equals(userId)) {
            throw new InvalidArgumentException("Unauthorized to delete this item");
        }

        cartRepo.deleteById(cartItemId);
    }

}

