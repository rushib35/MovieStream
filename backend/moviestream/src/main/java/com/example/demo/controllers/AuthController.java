package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entities.User;
import com.example.demo.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(
            @Valid @RequestBody User user) {

        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody LoginRequest loginRequest) {

        return userService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
    }
}