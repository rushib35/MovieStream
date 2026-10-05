package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    @NotBlank(message = "Name cannot be blank")
    private String name;


    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Column(unique = true, nullable = false)
    private String email;


    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$",
        message = "Password must contain at least 8 characters, one uppercase, one lowercase, one digit and one special character"
    )
    private String password;


    @Enumerated(EnumType.STRING)
    private Role role;


    @Enumerated(EnumType.STRING)
    private Membership membership = Membership.FREE;


    // Default constructor
    public User() {
        super();
    }


    // Parameterized constructor
    public User(
            Integer id,
            String name,
            String email,
            String password,
            Role role) {

        super();

        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }


    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


    public Membership getMembership() {
        return membership;
    }

    public void setMembership(Membership membership) {
        this.membership = membership;
    }


    @Override
    public String toString() {

        return "User [id=" + id
                + ", name=" + name
                + ", email=" + email
                + ", role=" + role
                + ", membership=" + membership
                + "]";
    }
}