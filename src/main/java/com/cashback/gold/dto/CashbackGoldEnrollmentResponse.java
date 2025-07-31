package com.cashback.gold.dto;

import com.cashback.gold.enums.EnrollmentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CashbackGoldEnrollmentResponse {

    private Long enrollmentId;

    private String schemeName;

    private BigDecimal totalPaid;

    private BigDecimal goldAccumulated;

    private boolean activated;

    private boolean recalled;

    private EnrollmentStatus status;
}
