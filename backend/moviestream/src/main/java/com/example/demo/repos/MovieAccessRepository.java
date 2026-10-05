package com.example.demo.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.MovieAccess;

public interface MovieAccessRepository extends JpaRepository<MovieAccess, Integer> {

    Optional<MovieAccess> findByUserIdAndMovieId(Integer userId, Integer movieId);

    void deleteByUserId(Integer userId);
}