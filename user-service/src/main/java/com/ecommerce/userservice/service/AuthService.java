package com.ecommerce.userservice.service;

import com.ecommerce.userservice.dto.UserRequest;
import com.ecommerce.userservice.model.User;
import com.ecommerce.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public String registerUser(UserRequest userRequest) {
        // Check if user already exists
        if (userRepository.findByUsername(userRequest.getUsername()).isPresent()) {
            return "Username already taken";
        }

        User user = User.builder()
                .username(userRequest.getUsername())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .email(userRequest.getEmail())
                .role("USER")
                .build();

        userRepository.save(user);
        log.info("User {} registered successfully", userRequest.getUsername());
        return "User registered successfully";
    }

    // Auth/token generation is now handled by Supabase Auth
    // This service only manages user profile data
}
