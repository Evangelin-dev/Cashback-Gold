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
                .cors(cors -> cors.configure(http))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> req
                                // Public endpoints
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/admin/sip-plans").permitAll()

                                .requestMatchers(HttpMethod.POST, "/api/orders").hasAuthority("USER")
                                .requestMatchers(HttpMethod.GET, "/api/orders/**").hasAnyAuthority("USER", "ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/orders/my").hasAnyAuthority("USER", "PARTNER", "B2B")

                                // 🛒 Ornament Cart & Order APIs
                                .requestMatchers("/api/cart/add").hasAuthority("USER")
                                .requestMatchers(HttpMethod.GET, "/api/cart").hasAuthority("USER")
                                .requestMatchers(HttpMethod.DELETE, "/api/cart/clear").hasAuthority("USER")
                                .requestMatchers(HttpMethod.POST, "/api/orders/ornament").hasAuthority("USER")

                                // Admin endpoints
                                .requestMatchers(HttpMethod.GET, "/admin/marketing-resources").hasAnyAuthority("ADMIN", "B2B", "PARTNER")
                                .requestMatchers(HttpMethod.GET, "/admin/ornaments").permitAll()
                                .requestMatchers(HttpMethod.GET, "/admin/ornaments/*").permitAll()
                                .requestMatchers(HttpMethod.GET, "/admin/ornaments/by-item-type").permitAll()

                                .requestMatchers("/admin/ornaments/**").hasAuthority("ADMIN") // restrict others
                                .requestMatchers("/admin/**").hasAuthority("ADMIN")
                                .requestMatchers("/admin/marketing-resources/**").hasAuthority("ADMIN")
                                .requestMatchers("/admin/marketing-resources").hasAuthority("ADMIN")
//                        .requestMatchers(HttpMethod.GET,"/admin/marketing-resources").hasAnyAuthority("ADMIN","B2B")
                                .requestMatchers("/api/admin/profile").hasAuthority("ADMIN")
//                        .requestMatchers("/api/kyc/**").hasAuthority("ADMIN") // for GET, PUT, DELETE, etc.
                                .requestMatchers(HttpMethod.GET, "/api/saving-plans").permitAll()

                                .requestMatchers("/api/saving-plans").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/gold-plants").permitAll()
                                .requestMatchers("/api/gold-plants").hasAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/admin/campaigns").hasAnyAuthority("ADMIN", "USER", "PARTNER", "B2B")
                                .requestMatchers("/api/admin/campaigns").hasAuthority("ADMIN")
                                .requestMatchers("/api/bank-accounts").hasAnyAuthority("ADMIN", "USER", "PARTNER", "B2B")
                                .requestMatchers(HttpMethod.GET, "/api/faqs").permitAll() // GET sabko allowed
                                .requestMatchers("/api/faqs/**").hasAuthority("ADMIN")    // POST/PUT/DELETE sirf ADMIN
                                // KYC endpoints for USER
                                .requestMatchers(HttpMethod.POST, "/api/kyc/user").hasAuthority("USER")
                                .requestMatchers(HttpMethod.GET, "/api/kyc/user").hasAuthority("USER")
                                // KYC endpoints for PARTNER
                                .requestMatchers(HttpMethod.POST, "/api/kyc/partner").hasAuthority("PARTNER")
                                .requestMatchers(HttpMethod.GET, "/api/kyc/partner/kyc").hasAuthority("PARTNER")
                                // KYC endpoints for B2B
                                .requestMatchers(HttpMethod.POST, "/api/kyc/b2b").hasAuthority("B2B")
                                .requestMatchers(HttpMethod.GET, "/api/kyc/b2b/kyc").hasAuthority("B2B")
                                // Admin KYC management
                                .requestMatchers("/api/kyc/admin/**").hasAuthority("ADMIN")
                                // B2B profile endpoints
                                .requestMatchers("/api/b2b/profile").hasAuthority("B2B")
                                // Original KYC endpoint (optional, if still used)
                                .requestMatchers(HttpMethod.POST, "/api/kyc").hasAnyAuthority("USER", "B2B", "PARTNER")
                                .requestMatchers("/wallet/**").hasAnyAuthority("B2B")
                                .requestMatchers("/api/gold/admin/**").hasAuthority("ADMIN") // ✅ Gold admin APIs
                                .requestMatchers(HttpMethod.POST, "/api/b2b/support").hasAnyAuthority("B2B", "PARTNER")
                                .requestMatchers("/api/b2b/support/admin/**").hasAuthority("ADMIN")
                                .requestMatchers("/api/sips").hasAnyAuthority("B2B")

                                // ✅ Gold Purchase APIs for Users and B2B
                                .requestMatchers("/api/gold/purchase").hasAnyAuthority("USER", "B2B")
                                .requestMatchers("/api/gold/user").hasAnyAuthority("USER", "B2B")
                                .requestMatchers("/api/gold/orders/my").hasAnyAuthority("USER", "B2B")
                                .requestMatchers("/api/gold/rate").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/flyers").hasAnyAuthority("ADMIN")
                                .requestMatchers(HttpMethod.DELETE, "/api/flyers").hasAnyAuthority("ADMIN")
                                .requestMatchers(HttpMethod.GET, "/api/flyers").permitAll()
                                .requestMatchers("/api/metal-rates").permitAll()
                                .requestMatchers("/api/inventory").hasAnyAuthority("ADMIN", "B2B")
                                // All other requests require authentication
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