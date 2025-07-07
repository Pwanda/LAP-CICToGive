package com.lap.service;

import com.lap.config.JwtUtil;
import com.lap.dto.AuthDTO;
import com.lap.entity.User;
import com.lap.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(
        AuthService.class
    );

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthDTO.LoginResponse login(AuthDTO.LoginRequest loginRequest) {
        try {
            logger.debug(
                "Attempting to authenticate user: {}",
                loginRequest.getUsername()
            );

            // Check if user exists first
            User user = userRepository
                .findByUsernameOrEmail(loginRequest.getUsername())
                .orElseThrow(() -> {
                    logger.warn(
                        "User not found: {}",
                        loginRequest.getUsername()
                    );
                    return new UsernameNotFoundException("User not found");
                });

            logger.debug(
                "User found: {} (ID: {}, Active: {})",
                user.getUsername(),
                user.getId(),
                user.getIsActive()
            );

            // Check if user is active
            if (!user.getIsActive()) {
                logger.warn(
                    "User is not active: {}",
                    loginRequest.getUsername()
                );
                throw new BadCredentialsException("User account is disabled");
            }

            // Authenticate user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            logger.debug(
                "Authentication successful for user: {}",
                loginRequest.getUsername()
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());

            logger.debug(
                "JWT token generated for user: {}",
                loginRequest.getUsername()
            );

            // Return response
            return new AuthDTO.LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl()
            );
        } catch (BadCredentialsException e) {
            logger.error(
                "Bad credentials for user: {} - {}",
                loginRequest.getUsername(),
                e.getMessage()
            );
            throw new BadCredentialsException("Invalid username or password");
        } catch (Exception e) {
            logger.error(
                "Unexpected error during login for user: {} - {}",
                loginRequest.getUsername(),
                e.getMessage(),
                e
            );
            throw e;
        }
    }

    public String register(AuthDTO.RegisterRequest registerRequest) {
        logger.debug(
            "Attempting to register user: {}",
            registerRequest.getUsername()
        );

        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            logger.warn(
                "Username already exists: {}",
                registerRequest.getUsername()
            );
            throw new RuntimeException("Username is already taken!");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warn("Email already exists: {}", registerRequest.getEmail());
            throw new RuntimeException("Email is already in use!");
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setIsActive(true);

        // Save user to database
        User savedUser = userRepository.save(user);
        logger.debug(
            "User registered successfully: {} (ID: {})",
            savedUser.getUsername(),
            savedUser.getId()
        );

        return "User registered successfully!";
    }

    public AuthDTO.UserResponse getCurrentUser(String username) {
        User user = userRepository
            .findByUsername(username)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "User not found with username: " + username
                )
            );

        return new AuthDTO.UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getAvatarUrl()
        );
    }

    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    public String getUsernameFromToken(String token) {
        return jwtUtil.getUsernameFromToken(token);
    }
}
