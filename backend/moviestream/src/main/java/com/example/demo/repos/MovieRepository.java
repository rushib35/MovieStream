package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.Movie;

public interface MovieRepository extends JpaRepository<Movie, Integer> {

}