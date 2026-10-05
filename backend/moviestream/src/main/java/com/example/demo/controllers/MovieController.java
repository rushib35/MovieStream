package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Movie;
import com.example.demo.entities.User;
import com.example.demo.repos.UserRepository;
import com.example.demo.services.MovieService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private UserRepository userRepository;


    // Get all movies
    // Public access
    @GetMapping("/movies")
    public List<Movie> getAllMovies() {

        return movieService.getAllMovies();
    }


    // Add a new movie
    // Admin only
    @PostMapping("/movies")
    @PreAuthorize("hasRole('ADMIN')")
    public Movie saveMovie(@RequestBody Movie movie) {

        return movieService.saveMovie(movie);
    }


    // Get movie by ID
    // Requires login
    @GetMapping("/movies/{id}")
    public Movie getMovieById(@PathVariable Integer id) {

        return movieService.getMovieById(id);
    }


    // Watch movie
    // FREE movie -> FREE and GOLD users can watch
    // PREMIUM movie -> GOLD users only
    @GetMapping("/movies/{id}/watch")
    public ResponseEntity<?> watchMovie(
            @PathVariable Integer id,
            Authentication authentication) {

        // Get logged-in user's email from JWT
        String email = authentication.getName();

        // Find logged-in user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found")
                );

        // Find movie
        Movie movie = movieService.getMovieById(id);

        // Check movie access
        boolean canWatch = movieService.canWatchMovie(
                movie,
                user.getMembership()
        );

        // Access denied
        if (!canWatch) {

            return ResponseEntity
                    .status(403)
                    .body(
                        "Gold membership required to watch this movie"
                    );
        }

        // Access allowed
        return ResponseEntity.ok(movie.getVideoUrl());
    }


    // Delete movie
    // Admin only
    @DeleteMapping("/movies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteMovie(@PathVariable Integer id) {

        movieService.deleteMovie(id);

        return "Movie deleted successfully with id: " + id;
    }


    // Update movie
    // Admin only
    @PutMapping("/movies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Movie updateMovie(
            @PathVariable Integer id,
            @RequestBody Movie movie) {

        return movieService.updateMovie(id, movie);
    }

}