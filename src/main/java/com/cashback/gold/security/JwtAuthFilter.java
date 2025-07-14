package com.cashback.gold.security;

import com.cashback.gold.dto.common.ApiResponse; // ✅ Added
import com.cashback.gold.service.UserAuthService;
import com.cashback.gold.service.jwt.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper; // ✅ Added
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserAuthService userAuthService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        String userId = null;
        ObjectMapper mapper = new ObjectMapper(); // ✅ Added

        try {
            userId = jwtService.extractUserId(token);
        } catch (ExpiredJwtException e) {
            // ✅ Handle expired token
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            ApiResponse apiResponse = ApiResponse.error("Token expired");
            response.getWriter().write(mapper.writeValueAsString(apiResponse));
            return;
        } catch (JwtException | IllegalArgumentException e) {
            // ✅ Handle invalid token
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            ApiResponse apiResponse = ApiResponse.error("Invalid token");
            response.getWriter().write(mapper.writeValueAsString(apiResponse));
            return;
        }

        if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = userAuthService.loadUserById(userId);

            var authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
