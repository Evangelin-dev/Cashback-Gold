package com.cashback.gold.service;

import com.cashback.gold.dto.AddressDTO;
import com.cashback.gold.dto.AddressRequest;
import com.cashback.gold.entity.Address;
import com.cashback.gold.entity.User;
import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.AddressRepository;
import com.cashback.gold.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressDTO addAddress(Long userId, AddressDTO dto) {
        User user = userRepository.findById(userId).orElseThrow();
        Address address = Address.builder()
                .fullName(dto.getFullName())
                .mobile(dto.getMobile())
                .addressLine1(dto.getAddressLine1())
                .addressLine2(dto.getAddressLine2())
                .city(dto.getCity())
                .state(dto.getState())
                .postalCode(dto.getPostalCode())
                .user(user)
                .build();
        return toDTO(addressRepository.save(address));
    }

    public List<AddressDTO> getAddresses(Long userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }

    private AddressDTO toDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setFullName(address.getFullName());
        dto.setMobile(address.getMobile());
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setPostalCode(address.getPostalCode());
        return dto;
    }

    public Address updateAddress(Long addressId, AddressRequest request, Long userId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new InvalidArgumentException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new InvalidArgumentException("You cannot update this address");
        }

        address.setFullName(request.getFullName());
        address.setMobile(request.getMobile());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPostalCode(request.getPostalCode());

        return addressRepository.save(address);
    }
}
