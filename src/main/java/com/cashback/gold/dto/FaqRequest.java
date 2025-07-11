package com.cashback.gold.dto;

import com.cashback.gold.enums.FaqType;
import lombok.Data;

@Data
public class FaqRequest {
    private String question;
    private String answer;
    private FaqType type;
}

