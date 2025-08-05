package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class NomineeResponse {
    private Long id;
    private String fullName;
    private String relationship;
    private LocalDate dob;
    private String gender;
}
