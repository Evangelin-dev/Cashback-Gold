package com.cashback.gold.dto;

import com.cashback.gold.enums.ContactStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactStatusUpdateRequest {
    @NotNull
    private ContactStatus status;
}
