package com.example.demo.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Movie;
import com.example.demo.entities.MovieAccess;
import com.example.demo.entities.User;

import com.example.demo.repos.MovieAccessRepository;
import com.example.demo.repos.MovieRepository;
import com.example.demo.repos.UserRepository;

import com.example.demo.dto.MovieAccessResponse;

@Service
public class MovieAccessService {

    @Autowired
    private MovieAccessRepository movieAccessRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    public MovieAccess grantAccess(User user, Movie movie) {

        MovieAccess existingAccess =
                movieAccessRepository
                        .findByUserIdAndMovieId(user.getId(), movie.getId())
                        .orElse(null);

        if (existingAccess != null) {
            return existingAccess;
        }

        MovieAccess movieAccess = new MovieAccess();

        movieAccess.setUser(user);
        movieAccess.setMovie(movie);
        movieAccess.setAccessDate(LocalDateTime.now());

        return movieAccessRepository.save(movieAccess);
    }

    public MovieAccessResponse hasAccess(Integer userId, Integer movieId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found with id: " + userId));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() ->
                        new RuntimeException("Movie not found with id: " + movieId));

        // FREE movie → everyone can watch
        if (!movie.isPremium()) {

            return new MovieAccessResponse(
                    true,
                    "You can watch this movie"
            );
        }

        // PREMIUM movie → GOLD members can watch
        if (user.getMembership().name().equals("GOLD")) {

            return new MovieAccessResponse(
                    true,
                    "You can watch this premium movie"
            );
        }

        // PREMIUM movie + FREE membership
        return new MovieAccessResponse(
                false,
                "Upgrade to Gold membership to watch this movie"
        );
    }
}