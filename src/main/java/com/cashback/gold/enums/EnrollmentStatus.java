package com.cashback.gold.enums;

public enum EnrollmentStatus {
    ENROLLED,       // User has joined the scheme, accumulating gold
    ACTIVATED,      // User's accumulated gold ≥ 1gm
    RECALL_REQUESTED, // User has requested to recall/withdraw
    COMPLETED,      // Full 36-month duration completed
    WITHDRAWN,      // Scheme recalled before completion (with penalty)
    CANCELLED       // Manually cancelled or invalidated
}
