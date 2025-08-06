package com.cashback.gold.dto;

import com.cashback.gold.enums.ContactStatus;
import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ContactResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String message;
    private ContactStatus status;
    private OffsetDateTime createdAt;
}
