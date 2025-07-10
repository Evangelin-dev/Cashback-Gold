package com.cashback.gold.repository;

import com.cashback.gold.entity.MarketingResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketingResourceRepository extends JpaRepository<MarketingResource, Long> {
}
