package com.cashback.gold.service;

import com.cashback.gold.dto.PagedWishlistResponse;
import com.cashback.gold.dto.WishlistItemResponse;
import com.cashback.gold.entity.Ornament;
import com.cashback.gold.entity.User;
import com.cashback.gold.entity.WishlistItem;
import com.cashback.gold.repository.OrnamentRepository;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.repository.WishlistRepository;
import com.cashback.gold.security.UserPrincipal;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final OrnamentRepository ornamentRepository;

    private User requireUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private Ornament requireOrnament(Long id) {
        return ornamentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Ornament not found"));
    }

    @Transactional
    public void add(UserPrincipal principal, Long ornamentId) {
        User user = requireUser(principal.getId());
        Ornament ornament = requireOrnament(ornamentId);

        if (wishlistRepository.existsByUserAndOrnament(user, ornament)) {
            // idempotent: ignore if already exists
            return;
        }
        WishlistItem item = WishlistItem.builder()
                .user(user)
                .ornament(ornament)
                .build();
        wishlistRepository.save(item);
    }

    @Transactional
    public void remove(UserPrincipal principal, Long ornamentId) {
        User user = requireUser(principal.getId());
        Ornament ornament = requireOrnament(ornamentId);
        wishlistRepository.deleteByUserAndOrnament(user, ornament);
    }

    @Transactional(readOnly = true)
    public PagedWishlistResponse list(UserPrincipal principal, int page, int size) {
        User user = requireUser(principal.getId());
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<WishlistItem> p = wishlistRepository.findAllByUser(user, pageable);

        return PagedWishlistResponse.builder()
                .items(p.getContent().stream().map(w -> {
                    var o = w.getOrnament();
                    // If you store totalPrice in ornament, use it; otherwise compute from priceBreakups
                    BigDecimal totalPrice = null;
                    try {
                        totalPrice = BigDecimal.valueOf(o.getTotalPriceAfterDiscount()); // adjust if your entity differs
                    } catch (Exception ignored) {}

                    return WishlistItemResponse.builder()
                            .ornamentId(o.getId())
                            .name(o.getName())
                            .mainImage(o.getMainImage())
                            .category(o.getCategory())
                            .itemType(o.getItemType())
                            .purity(o.getPurity())
                            .totalPrice(totalPrice)
                            .build();
                }).collect(Collectors.toList()))
                .page(p.getNumber())
                .size(p.getSize())
                .totalElements(p.getTotalElements())
                .totalPages(p.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public boolean exists(UserPrincipal principal, Long ornamentId) {
        User user = requireUser(principal.getId());
        Ornament ornament = requireOrnament(ornamentId);
        return wishlistRepository.existsByUserAndOrnament(user, ornament);
    }

    @Transactional(readOnly = true)
    public long count(UserPrincipal principal) {
        User user = requireUser(principal.getId());
        return wishlistRepository.countByUser(user);
    }
}
