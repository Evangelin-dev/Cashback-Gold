package com.cashback.gold.controller;

import com.cashback.gold.dto.AddressDTO;
import com.cashback.gold.dto.AddressRequest;
import com.cashback.gold.entity.Address;
import com.cashback.gold.security.UserPrincipal;
import com.cashback.gold.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("user/addresses")
@RequiredArgsConstructor
@Tag(name = "Address Controller", description = "Manage user delivery addresses")
public class AddressController {

    private final AddressService addressService;

    @Operation(summary = "Add a new address")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address added successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<AddressDTO> addAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody AddressDTO dto) {
        return ResponseEntity.ok(addressService.addAddress(principal.getId(), dto));
    }

    @Operation(summary = "Get all addresses for logged-in user")
    @ApiResponse(responseCode = "200", description = "List of addresses retrieved")
    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(addressService.getAddresses(principal.getId()));
    }

    @Operation(summary = "Delete an address by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Address deleted"),
            @ApiResponse(responseCode = "404", description = "Address not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "Address ID to delete") @PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Update an existing address by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address updated successfully"),
            @ApiResponse(responseCode = "404", description = "Address not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(
            @Parameter(description = "Address ID to update") @PathVariable Long id,
            @RequestBody AddressRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Address updated = addressService.updateAddress(id, request, principal.getId());
        return ResponseEntity.ok(updated);
    }
}
