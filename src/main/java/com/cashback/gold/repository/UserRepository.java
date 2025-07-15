package com.cashback.gold.repository;

import com.cashback.gold.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Optional<User> findById(Long id);
    Page<User> findByRoleIgnoreCase(String role, Pageable pageable);
    Optional<User> findByEmailOrMobile(String email, String mobile);
    long countByRoleIgnoreCase(String role);


}
