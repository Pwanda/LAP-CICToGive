package com.lap.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
        if (
            requestTokenHeader != null &&
            requestTokenHeader.startsWith("Bearer ")
        ) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
                logger.debug("JWT token found, username: " + username);
            } catch (Exception e) {
                logger.error(
                    "Unable to get JWT Token or JWT Token has expired",
                    e
                );
            }
        } else {
            logger.debug(
                "No JWT token found in request header: " + requestTokenHeader
            );
        }

        // Once we get the token validate it.
        if (
            username != null &&
            SecurityContextHolder.getContext().getAuthentication() == null
        ) {
            UserDetails userDetails =
                this.userDetailsService.loadUserByUsername(username);

            // if token is valid configure Spring Security to manually set authentication
            if (jwtUtil.validateToken(jwtToken, userDetails)) {
                logger.debug(
                    "JWT token validated successfully for user: " + username
                );

                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the Spring Security Configurations successfully.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                logger.debug(
                    "JWT token validation failed for user: " + username
                );
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request)
        throws ServletException {
        String path = request.getRequestURI();
        // Skip JWT filter for auth endpoints
        boolean skip =
            path.startsWith("/api/auth/login") ||
            path.startsWith("/api/auth/register") ||
            path.startsWith("/error") ||
            path.startsWith("/favicon.ico");

        if (skip) {
            logger.debug("Skipping JWT filter for path: " + path);
        } else {
            logger.debug("Applying JWT filter for path: " + path);
        }

        return skip;
    }
}
