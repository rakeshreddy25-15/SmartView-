package com.smartview.smartview.controller;

import com.smartview.smartview.model.User;
import com.smartview.smartview.repository.UserRepository;
import com.smartview.smartview.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Signup successful"));
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User body) {
        Optional<User> existing = userRepository.findByEmail(body.getEmail());
        if (existing.isPresent() && encoder.matches(body.getPassword(), existing.get().getPassword())) {
            String token = jwtUtil.generateToken(body.getEmail());
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token
            ));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
    }
}
