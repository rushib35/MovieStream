import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Home() {

  const [movies, setMovies] = useState([]);

  // Hero carousel
  const [heroSlide, setHeroSlide] = useState(0);

  // Separate carousel position for each movie section
  const [carouselIndexes, setCarouselIndexes] = useState({
    popular: 0,
    gold: 0
  });


  // =========================================================
  // FETCH MOVIES
  // =========================================================

  useEffect(() => {

    axios
      .get("http://localhost:8080/movies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      .then(response => {

        setMovies(response.data);

      })
      .catch(error => {

        console.error(
          "Error fetching movies:",
          error
        );

      });

  }, []);


  // =========================================================
  // FILTER MOVIES
  // =========================================================

  const popularMovies = movies.filter(
    movie => !movie.premium
  );

  const goldMovies = movies.filter(
    movie => movie.premium
  );


  // =========================================================
  // HERO MOVIES
  // =========================================================

  const heroMovies = movies.slice(0, 3);

  const totalHeroSlides = 1 + heroMovies.length;


  // =========================================================
  // HERO AUTO SLIDER
  // =========================================================

  useEffect(() => {

    if (totalHeroSlides <= 1) {
      return;
    }

    const interval = setInterval(() => {

      setHeroSlide(prev => {

        return (prev + 1) % totalHeroSlides;

      });

    }, 5000);

    return () => clearInterval(interval);

  }, [totalHeroSlides]);


  // =========================================================
  // NEXT HERO
  // =========================================================

  const nextHeroSlide = () => {

    setHeroSlide(prev => {

      return (prev + 1) % totalHeroSlides;

    });

  };


  // =========================================================
  // PREVIOUS HERO
  // =========================================================

  const previousHeroSlide = () => {

    setHeroSlide(prev => {

      return prev === 0
        ? totalHeroSlides - 1
        : prev - 1;

    });

  };


  // =========================================================
  // MOVIE CAROUSEL SETTINGS
  // =========================================================

  const moviesPerPage = 5;


  // =========================================================
  // GET CAROUSEL KEY
  // =========================================================

  const getCarouselKey = (title) => {

    if (title.includes("Popular")) {
      return "popular";
    }

    return "gold";

  };


  // =========================================================
  // NEXT MOVIE CAROUSEL
  // =========================================================

  const nextMovieSlide = (key, movieList) => {

    const totalSlides = Math.ceil(
      movieList.length / moviesPerPage
    );

    if (totalSlides <= 1) {
      return;
    }

    setCarouselIndexes(prev => ({

      ...prev,

      [key]:
        (prev[key] + 1) % totalSlides

    }));

  };


  // =========================================================
  // PREVIOUS MOVIE CAROUSEL
  // =========================================================

  const previousMovieSlide = (key, movieList) => {

    const totalSlides = Math.ceil(
      movieList.length / moviesPerPage
    );

    if (totalSlides <= 1) {
      return;
    }

    setCarouselIndexes(prev => ({

      ...prev,

      [key]:
        prev[key] === 0
          ? totalSlides - 1
          : prev[key] - 1

    }));

  };


  // =========================================================
  // GO TO MOVIE SLIDE
  // =========================================================

  const goToMovieSlide = (key, index) => {

    setCarouselIndexes(prev => ({

      ...prev,

      [key]: index

    }));

  };


  // =========================================================
  // RENDER MOVIE CAROUSEL
  // =========================================================

  const renderMovieRow = (title, movieList) => {

    const carouselKey = getCarouselKey(title);

    const currentSlide =
      carouselIndexes[carouselKey];

    const totalSlides = Math.ceil(
      movieList.length / moviesPerPage
    );

    const visibleMovies = movieList.slice(

      currentSlide * moviesPerPage,

      currentSlide * moviesPerPage + moviesPerPage

    );


    return (

      <section
        className="movie-row-section"
        key={title}
      >

        {/* =========================
            ROW HEADER
        ========================= */}

        <div className="row-header">

          <h2>
            {title}
          </h2>

          <Link to="/movies">
            See All →
          </Link>

        </div>


        {/* =========================
            MOVIE CAROUSEL
        ========================= */}

        <div className="movie-row-wrapper">


          {/* LEFT ARROW */}

          {totalSlides > 1 && (

            <button
              className="movie-arrow movie-arrow-left"
              onClick={() =>
                previousMovieSlide(
                  carouselKey,
                  movieList
                )
              }
            >
              ‹
            </button>

          )}


          {/* MOVIE CARDS */}

          <div className="movie-row">

            {visibleMovies.map(movie => (

              <Link
                to={`/movies/${movie.id}/watch`}
                className="home-movie-link"
                key={`${title}-${movie.id}`}
              >

                <div className="home-movie-card">


                  {/* POSTER */}

                  <div className="home-poster-container">

                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                    />


                    {/* GOLD BADGE */}

                    {movie.premium && (

                      <span className="home-gold-badge">

                        ⭐ GOLD

                      </span>

                    )}

                  </div>


                  {/* MOVIE INFORMATION */}

                  <div className="home-movie-info">

                    <h3>
                      {movie.title}
                    </h3>

                    <p>
                      {movie.genre}
                    </p>

                  </div>

                </div>

              </Link>

            ))}

          </div>


          {/* RIGHT ARROW */}

          {totalSlides > 1 && (

            <button
              className="movie-arrow movie-arrow-right"
              onClick={() =>
                nextMovieSlide(
                  carouselKey,
                  movieList
                )
              }
            >
              ›
            </button>

          )}

        </div>


        {/* =========================
            MOVIE CAROUSEL DOTS
        ========================= */}

        {totalSlides > 1 && (

          <div className="movie-carousel-dots">

            {Array.from({
              length: totalSlides
            }).map((_, index) => (

              <button
                key={index}
                className={
                  currentSlide === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  goToMovieSlide(
                    carouselKey,
                    index
                  )
                }
              />

            ))}

          </div>

        )}

      </section>

    );

  };


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <div className="home">


      {/* =====================================================
          HERO CAROUSEL
      ===================================================== */}

      <section className="hero-carousel">


        {/* =================================================
            DEFAULT MOVIESTREAM SLIDE
        ================================================= */}

        {heroSlide === 0 && (

          <div className="hero-section hero-default">

            <div className="hero-content">

              <p className="hero-small-title">
                🎬 WELCOME TO MOVIESTREAM
              </p>


              <h1>

                Watch Amazing

                <span>
                  Movie Trailers
                </span>

              </h1>


              <p className="hero-description">

                Discover the latest movies,
                watch free trailers,
                and unlock exclusive
                content with Gold membership.

              </p>


              <div className="hero-buttons">

                <Link
                  to="/movies"
                  className="watch-btn"
                >
                  🎬 Browse Movies
                </Link>


                <Link
                  to="/gold"
                  className="gold-btn"
                >
                  ⭐ Get Gold
                </Link>

              </div>

            </div>

          </div>

        )}


        {/* =================================================
            FEATURED MOVIE SLIDES
        ================================================= */}

        {heroSlide > 0 &&
          heroMovies[heroSlide - 1] && (

          <div className="hero-section hero-movie">


            {/* =============================================
                BLURRED MOVIE BACKGROUND
            ============================================= */}

            <div
              className="hero-background"
              style={{
                backgroundImage:
                  `url(${heroMovies[heroSlide - 1].posterUrl})`
              }}
            />


            {/* =============================================
                DARK OVERLAY
            ============================================= */}

            <div className="hero-overlay" />


            {/* =============================================
                MOVIE INFORMATION
            ============================================= */}

            <div className="hero-movie-content">


              <p className="hero-small-title">

                🎬 FEATURED MOVIE

              </p>


              <h1>

                {heroMovies[
                  heroSlide - 1
                ].title}

              </h1>


              <p className="hero-description">

                {heroMovies[
                  heroSlide - 1
                ].description}

              </p>


              <div className="hero-buttons">

                <Link
                  to={`/movies/${heroMovies[
                    heroSlide - 1
                  ].id}/watch`}
                  className="watch-btn"
                >
                  🎬 Watch Trailer
                </Link>


                {heroMovies[
                  heroSlide - 1
                ].premium && (

                  <Link
                    to="/gold"
                    className="gold-btn"
                  >
                    ⭐ Get Gold
                  </Link>

                )}

              </div>

            </div>


            {/* =============================================
                SHARP MOVIE POSTER
            ============================================= */}

            <div className="hero-poster">

              <img
                src={
                  heroMovies[
                    heroSlide - 1
                  ].posterUrl
                }
                alt={
                  heroMovies[
                    heroSlide - 1
                  ].title
                }
              />

            </div>

          </div>

        )}


        {/* =================================================
            HERO LEFT ARROW
        ================================================= */}

        {totalHeroSlides > 1 && (

          <button
            className="hero-arrow hero-arrow-left"
            onClick={previousHeroSlide}
          >
            ‹
          </button>

        )}


        {/* =================================================
            HERO RIGHT ARROW
        ================================================= */}

        {totalHeroSlides > 1 && (

          <button
            className="hero-arrow hero-arrow-right"
            onClick={nextHeroSlide}
          >
            ›
          </button>

        )}


        {/* =================================================
            HERO DOTS
        ================================================= */}

        {totalHeroSlides > 1 && (

          <div className="hero-dots">

            {Array.from({
              length: totalHeroSlides
            }).map((_, index) => (

              <button
                key={index}
                className={
                  heroSlide === index
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setHeroSlide(index)
                }
              />

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          MOVIE POSTER CAROUSELS
      ===================================================== */}

      <div className="movie-sections">


        {/* POPULAR MOVIES */}

        {popularMovies.length > 0 &&
          renderMovieRow(
            "🔥 Popular Movies",
            popularMovies
          )}


        {/* GOLD MOVIES */}

        {goldMovies.length > 0 &&
          renderMovieRow(
            "⭐ Gold Exclusives",
            goldMovies
          )}

      </div>

    </div>

  );

}

export default Home;