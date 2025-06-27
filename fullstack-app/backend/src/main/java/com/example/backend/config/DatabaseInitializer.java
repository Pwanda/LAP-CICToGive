package com.example.backend.config;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            String rawPassword = "adminpass";
            String hashedPassword = passwordEncoder.encode(rawPassword);
            User user = new User("admin", "admin@example.com", hashedPassword);
            userRepository.save(user);
            System.out.println(
                "Standard-User 'admin' wurde angelegt (Passwort gehasht)."
            );
        }
    }
}
