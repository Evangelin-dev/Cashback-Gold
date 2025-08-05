package com.cashback.gold.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class NomineeRequest {
    private String fullName;
    private String relationship;
    private LocalDate dob;
    private String gender;
}
