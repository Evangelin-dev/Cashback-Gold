package com.cashback.gold.repository;

import com.cashback.gold.entity.Flyer;
import com.cashback.gold.enums.FlyerType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlyerRepository extends JpaRepository<Flyer, Long> {
    List<Flyer> findAllByOrderByUploadDateDesc();
    List<Flyer> findByTypeOrderByUploadDateDesc(FlyerType type);

}

