package com.cashback.gold.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/admin/**").hasAuthority("ADMIN")
                        .requestMatchers("/admin/ornaments/**").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/kyc").hasAnyAuthority("USER", "B2B", "PARTNER")
                        .requestMatchers("/api/kyc/**").hasAuthority("ADMIN") // for GET, PUT, DELETE, etc.
                        .requestMatchers("/admin/marketing-resources/**").hasAuthority("ADMIN")
                        .requestMatchers("/admin/marketing-resources").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/profile").hasAuthority("ADMIN")
                        .requestMatchers("/api/saving-plans").hasAuthority("ADMIN")
                        .requestMatchers("/api/gold-plants").hasAuthority("ADMIN")
                        .requestMatchers("/api/admin/campaigns").hasAuthority("ADMIN")
                        .requestMatchers("/api/bank-accounts").hasAuthority("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
