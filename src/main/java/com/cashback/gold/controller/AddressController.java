package com.cashback.gold.controller;

import com.cashback.gold.dto.AddressDTO;
import com.cashback.gold.dto.AddressRequest;
import com.cashback.gold.entity.Address;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("user/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressDTO> addAddress(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestBody AddressDTO dto) {
        return ResponseEntity.ok(addressService.addAddress(principal.getId(), dto));
    }

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(addressService.getAddresses(principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Long id,
            @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Address updated = addressService.updateAddress(id, request, principal.getId());
        return ResponseEntity.ok(updated);
    }
}
