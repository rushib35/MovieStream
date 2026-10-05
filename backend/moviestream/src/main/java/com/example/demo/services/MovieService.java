package com.example.demo.services;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Movie;
import com.example.demo.repos.MovieRepository;

import com.example.demo.exceptions.MovieNotFoundException;
import com.example.demo.entities.Membership;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

	

    public Movie saveMovie(Movie movie) {
        return movieRepository.save(movie);
    }
    
    public Movie getMovieById(Integer id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + id));
    }
    
    public void deleteMovie(Integer id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + id));

        movieRepository.delete(movie);
    }
    
    public Movie updateMovie(Integer id, Movie updatedMovie) {

        Movie existingMovie = movieRepository.findById(id)
                .orElseThrow(() -> new MovieNotFoundException("Movie not found with id: " + id));

        existingMovie.setTitle(updatedMovie.getTitle());
        existingMovie.setDescription(updatedMovie.getDescription());
        existingMovie.setGenre(updatedMovie.getGenre());
        existingMovie.setPosterUrl(updatedMovie.getPosterUrl());
        existingMovie.setVideoUrl(updatedMovie.getVideoUrl());
        existingMovie.setReleaseYear(updatedMovie.getReleaseYear());
        existingMovie.setPrice(updatedMovie.getPrice());
        existingMovie.setPremium(updatedMovie.isPremium());

        return movieRepository.save(existingMovie);
    }
    
  

    public boolean canWatchMovie(Movie movie, Membership membership) {

        // Free movie → everyone can watch
        if (!movie.isPremium()) {
            return true;
        }

        // Premium movie → only GOLD members can watch
        return membership == Membership.GOLD;
    }
    
    
    
    
}