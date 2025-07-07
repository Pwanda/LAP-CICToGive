package com.lap.controller;

import com.lap.dto.AuthDTO;
import com.lap.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(
        AuthController.class
    );

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @Valid @RequestBody AuthDTO.LoginRequest loginRequest
    ) {
        try {
            logger.debug(
                "Login attempt for username: {}",
                loginRequest.getUsername()
            );
            AuthDTO.LoginResponse response = authService.login(loginRequest);
            logger.debug(
                "Login successful for username: {}",
                loginRequest.getUsername()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error(
                "Login failed for username: {} - Error: {}",
                loginRequest.getUsername(),
                e.getMessage(),
                e
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse("Invalid username or password")
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Valid @RequestBody AuthDTO.RegisterRequest registerRequest
    ) {
        try {
            logger.debug(
                "Registration attempt for username: {}",
                registerRequest.getUsername()
            );
            String message = authService.register(registerRequest);
            logger.debug(
                "Registration successful for username: {}",
                registerRequest.getUsername()
            );
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            logger.error(
                "Registration failed for username: {} - Error: {}",
                registerRequest.getUsername(),
                e.getMessage(),
                e
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ErrorResponse(e.getMessage())
            );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Since we're using JWT tokens, logout is handled on the client side
        // by removing the token from storage. The server doesn't need to do anything.
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            AuthDTO.UserResponse user = authService.getCurrentUser(username);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse("User not found")
            );
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(
        @RequestBody TokenValidationRequest request
    ) {
        try {
            boolean isValid = authService.validateToken(request.getToken());
            if (isValid) {
                String username = authService.getUsernameFromToken(
                    request.getToken()
                );
                AuthDTO.UserResponse user = authService.getCurrentUser(
                    username
                );
                return ResponseEntity.ok(
                    new TokenValidationResponse(true, user)
                );
            } else {
                return ResponseEntity.ok(
                    new TokenValidationResponse(false, null)
                );
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new TokenValidationResponse(false, null));
        }
    }

    // Inner classes for request/response DTOs
    public static class ErrorResponse {

        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class TokenValidationRequest {

        private String token;

        public TokenValidationRequest() {}

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    public static class TokenValidationResponse {

        private boolean valid;
        private AuthDTO.UserResponse user;

        public TokenValidationResponse(
            boolean valid,
            AuthDTO.UserResponse user
        ) {
            this.valid = valid;
            this.user = user;
        }

        public boolean isValid() {
            return valid;
        }

        public void setValid(boolean valid) {
            this.valid = valid;
        }

        public AuthDTO.UserResponse getUser() {
            return user;
        }

        public void setUser(AuthDTO.UserResponse user) {
            this.user = user;
        }
    }
}
