package com.cashback.gold.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserProfileResponse {
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String email;
    private String mobile;
    private String city;
    private String town;
    private String state;
    private String country;
}
