package com.example.demo.entities;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String description;

    private String genre;

    private String posterUrl;

    private String videoUrl;

    private Integer releaseYear;

    private BigDecimal price;

    private boolean premium;

    public Movie() {
        super();
    }

    public Movie(Integer id, String title, String description, String genre,
                 String posterUrl, String videoUrl,
                 Integer releaseYear, BigDecimal price, boolean premium) {

        super();

        this.id = id;
        this.title = title;
        this.description = description;
        this.genre = genre;
        this.posterUrl = posterUrl;
        this.videoUrl = videoUrl;
        this.releaseYear = releaseYear;
        this.price = price;
        this.premium = premium;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public boolean isPremium() {
        return premium;
    }

    public void setPremium(boolean premium) {
        this.premium = premium;
    }

    @Override
    public String toString() {
        return "Movie [id=" + id
                + ", title=" + title
                + ", description=" + description
                + ", genre=" + genre
                + ", posterUrl=" + posterUrl
                + ", videoUrl=" + videoUrl
                + ", releaseYear=" + releaseYear
                + ", price=" + price
                + ", premium=" + premium + "]";
    }
}