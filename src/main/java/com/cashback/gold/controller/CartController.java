package com.cashback.gold.controller;

import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long ornamentId, @RequestParam(defaultValue = "1") int qty,
                                       @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(cartService.addToCart(user.getId(), ornamentId, qty));
    }

    @GetMapping
    public ResponseEntity<?> getCart(@AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(cartService.getCart(user.getId()));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserPrincipal user) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok("Cart cleared.");
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal UserPrincipal user
    ) {
        cartService.removeItemFromCart(cartItemId, user.getId());
        return ResponseEntity.ok("Item removed from cart");
    }


}

