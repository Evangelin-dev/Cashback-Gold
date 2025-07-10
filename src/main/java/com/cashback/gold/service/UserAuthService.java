package com.cashback.gold.service;

import com.cashback.gold.exception.InvalidArgumentException;
import com.cashback.gold.repository.UserRepository;
import com.cashback.gold.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserAuthService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .or(() -> userRepository.findByMobile(username))
                .map(UserPrincipal::new)
                .orElseThrow(() -> new InvalidArgumentException("User not found"));
    }

    public UserDetails loadUserById(String id) {
        return userRepository.findById(Long.parseLong(id))
                .map(UserPrincipal::new)
                .orElseThrow(() -> new InvalidArgumentException("User not found"));
    }
}
