package com.cashback.gold.controller;

import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart Controller", description = "Manage user's shopping cart")
public class CartController {

    private final CartService cartService;

    @Operation(summary = "Add an ornament to the cart")
    @ApiResponse(responseCode = "200", description = "Item added to cart successfully")
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @Parameter(description = "Ornament ID") @RequestParam Long ornamentId,
            @Parameter(description = "Quantity") @RequestParam(defaultValue = "1") int qty,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(cartService.addToCart(user.getId(), ornamentId, qty));
    }

    @Operation(summary = "Get current user's cart")
    @ApiResponse(responseCode = "200", description = "Cart fetched successfully")
    @GetMapping
    public ResponseEntity<?> getCart(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal user
    ) {
        return ResponseEntity.ok(cartService.getCart(user.getId()));
    }

    @Operation(summary = "Clear the cart")
    @ApiResponse(responseCode = "200", description = "Cart cleared successfully")
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal user
    ) {
        cartService.clearCart(user.getId());
        return ResponseEntity.ok("Cart cleared.");
    }

    @Operation(summary = "Remove an item from the cart")
    @ApiResponse(responseCode = "200", description = "Item removed from cart successfully")
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeItem(
            @Parameter(description = "Cart item ID") @PathVariable Long cartItemId,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal user
    ) {
        cartService.removeItemFromCart(cartItemId, user.getId());
        return ResponseEntity.ok("Item removed from cart");
    }
}
