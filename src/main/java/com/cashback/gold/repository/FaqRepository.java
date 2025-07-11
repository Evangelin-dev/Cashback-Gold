package com.cashback.gold.repository;

import com.cashback.gold.entity.Faq;
import com.cashback.gold.enums.FaqType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FaqRepository extends JpaRepository<Faq, Long>, JpaSpecificationExecutor<Faq> {
    Page<Faq> findByType(FaqType type, Pageable pageable);
}