package com.cashback.gold.repository;

import com.cashback.gold.entity.RazorpayPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RazorpayPaymentRepository extends JpaRepository<RazorpayPayment, Long> {
}
