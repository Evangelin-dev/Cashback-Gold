package com.cashback.gold.repository;

import com.cashback.gold.entity.Ornament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface OrnamentRepository extends JpaRepository<Ornament, Long> {

        Page<Ornament> findAll(Pageable pageable);

}

