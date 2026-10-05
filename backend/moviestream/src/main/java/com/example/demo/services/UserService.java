package com.example.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.dto.LoginResponse;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repos.UserRepository;

import com.example.demo.entities.Membership;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;

    public User registerUser(User user) {

        if (userRepo.existsByEmail(user.getEmail())) {

            throw new RuntimeException("Email already registered");

        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setRole(Role.USER);

        user.setMembership(Membership.FREE);

        return userRepo.save(user);
    }
    
    public LoginResponse loginUser(String email, String password) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(token);
    }
}