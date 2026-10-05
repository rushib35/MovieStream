package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.MembershipUpdateRequest;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repos.UserRepository;

import com.example.demo.repos.MovieAccessRepository;
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private MovieAccessRepository movieAccessRepository;


    // Get current logged-in user

    @GetMapping("/users/me")
    public User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found")
                );
    }


    // Get all users

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // Create new admin

    @PostMapping("/users/create-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public User createAdmin(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {

            throw new RuntimeException(
                "Email already registered"
            );
        }

        // Always assign ADMIN role from backend
        // Never trust role sent from frontend

        user.setRole(Role.ADMIN);

        // Hash password before saving
        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }


    // Update user membership

    @PutMapping("/users/{id}/membership")
    @PreAuthorize("hasRole('ADMIN')")
    public User updateMembership(
            @PathVariable Integer id,
            @RequestBody MembershipUpdateRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("User not found")
                );

        user.setMembership(request.getMembership());

        return userRepository.save(user);
    }


    // Delete user

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public String deleteUser(@PathVariable Integer id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete dependent movie_access records first
        movieAccessRepository.deleteByUserId(id);

        // Delete the user after dependent records are removed
        userRepository.delete(user);

        return "User deleted successfully";
    }
}