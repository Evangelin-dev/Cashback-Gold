package com.cashback.gold.repository;

import com.cashback.gold.entity.KycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface KycRepository extends JpaRepository<KycDocument, Long> {

    Page<KycDocument> findByType(String type, Pageable pageable);

}
