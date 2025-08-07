package com.cashback.gold.controller;

import com.cashback.gold.dto.PagedWishlistResponse;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{ornamentId}")
    public ResponseEntity<Void> add(@AuthenticationPrincipal UserPrincipal principal,
                                    @PathVariable Long ornamentId) {
        wishlistService.add(principal, ornamentId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{ornamentId}")
    public ResponseEntity<Void> remove(@AuthenticationPrincipal UserPrincipal principal,
                                       @PathVariable Long ornamentId) {
        wishlistService.remove(principal, ornamentId);
        return ResponseEntity.noContent().build();
    }

//    @GetMapping
//    public ResponseEntity<PagedWishlistResponse> list(@AuthenticationPrincipal UserPrincipal principal,
//                                                      @RequestParam(defaultValue = "0") int page,
//                                                      @RequestParam(defaultValue = "30") int size) {
//        return ResponseEntity.ok(wishlistService.list(principal, page, size));
//    }

    @GetMapping("/exists/{ornamentId}")
    public ResponseEntity<Boolean> exists(@AuthenticationPrincipal UserPrincipal principal,
                                          @PathVariable Long ornamentId) {
        return ResponseEntity.ok(wishlistService.exists(principal, ornamentId));
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(wishlistService.count(principal));
    }
}
