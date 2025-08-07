package com.cashback.gold.repository;

import com.cashback.gold.entity.PriceBreakup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceBreakupRepository extends JpaRepository<PriceBreakup, Long> {

    // ✅ Delete all PriceBreakups by Ornament ID
    void deleteByOrnamentId(Long ornamentId);

    // ✅ If you also want to fetch price breakups separately
    List<PriceBreakup> findByOrnament_Id(Long ornamentId);
}
