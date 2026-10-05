package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.entities.Membership;
import com.example.demo.entities.User;
import com.example.demo.repos.UserRepository;
import org.springframework.security.core.Authentication;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/membership")
public class MembershipController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/upgrade")
    public User upgradeToGold(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setMembership(Membership.GOLD);

        return userRepository.save(user);
    }
    
    @GetMapping("/check/{userId}")
    public Membership checkMembership(@PathVariable Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getMembership();
    }
}