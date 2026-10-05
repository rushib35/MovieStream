package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Movie;
import com.example.demo.entities.User;
import com.example.demo.services.MovieAccessService;
import com.example.demo.repos.UserRepository;
import com.example.demo.repos.MovieRepository;
import com.example.demo.exceptions.MovieNotFoundException;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;

import com.example.demo.dto.MovieAccessResponse;

@RestController
@RequestMapping("/movie-access")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieAccessController {

    @Autowired
    private MovieAccessService movieAccessService;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @PostMapping("/grant")
    @PreAuthorize("hasRole('ADMIN')")
    public String grantAccess(
            @RequestBody MovieAccessRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + request.getUserId()));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() ->
                        new MovieNotFoundException(
                                "Movie not found with id: " + request.getMovieId()));

        movieAccessService.grantAccess(user, movie);

        return "Movie access granted successfully";
    }
    
    
    @GetMapping("/check/{movieId}")
    public MovieAccessResponse checkAccess(
            @PathVariable Integer movieId,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return movieAccessService.hasAccess(
                user.getId(),
                movieId
        );
    }

    public static class MovieAccessRequest {

        private Integer userId;
        private Integer movieId;

        public Integer getUserId() {
            return userId;
        }

        public void setUserId(Integer userId) {
            this.userId = userId;
        }

        public Integer getMovieId() {
            return movieId;
        }

        public void setMovieId(Integer movieId) {
            this.movieId = movieId;
        }
    }
}