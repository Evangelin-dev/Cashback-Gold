package com.cashback.gold.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactCreateRequest {

    @NotBlank @Size(max = 120)
    private String firstName;

    @NotBlank @Size(max = 120)
    private String lastName;

    @NotBlank @Email @Size(max = 180)
    private String email;

    @NotBlank @Size(min = 7, max = 32)
    private String phone;

    @Size(max = 5000)
    private String message;
}
