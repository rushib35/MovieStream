import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Movies.css";

function Movies() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");


  useEffect(() => {

    axios
      .get("http://localhost:8080/movies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      .then((response) => {

        setMovies(response.data);
        setLoading(false);

      })

      .catch((error) => {

        console.error("Error fetching movies:", error);

        setError(true);
        setLoading(false);

      });

  }, []);


  if (loading) {

    return (
      <div className="movies-page">

        <div className="movies-header">

          <h1>🎬 Movies</h1>

          <p>
            Loading movies...
          </p>

        </div>

      </div>
    );
  }


  if (error) {

    return (
      <div className="movies-page">

        <div className="movies-header">

          <h1>🎬 Movies</h1>

          <p>
            Unable to load movies from server.
          </p>

        </div>

      </div>
    );
  }


  const filteredMovies = movies.filter((movie) => {

    const title = movie.title || "";

    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "" ||
      movie.genre === selectedGenre;

    const matchesYear =
      selectedYear === "" ||
      String(movie.releaseYear) === selectedYear;

    return matchesSearch && matchesGenre && matchesYear;

  });


  const availableYears = [
    ...new Set(
      movies
        .map((movie) => movie.releaseYear)
        .filter((year) => year)
    )
  ].sort((a, b) => b - a);


  const availableGenres = [
    ...new Set(
      movies
        .map((movie) => movie.genre)
        .filter((genre) => genre)
    )
  ].sort();


  const isFiltering =
    searchTerm.trim() !== "" ||
    selectedGenre !== "" ||
    selectedYear !== "";


  const popularMovies = movies.filter(
    (movie) => !movie.premium
  );


  const goldMovies = movies.filter(
    (movie) => movie.premium
  );


  const freeMovies = movies.filter(
    (movie) => !movie.premium
  );


  const genreCategories = availableGenres
    .map((genre) => {

      return {
        title: `🎬 ${genre}`,
        genre: genre,
        movies: movies.filter(
          (movie) => movie.genre === genre
        )
      };

    })
    .filter(
      (category) => category.movies.length > 0
    );


  const renderMovieCard = (movie, categoryName) => {

    return (
      <div
        className="movie-card"
        key={`${categoryName}-${movie.id}`}
      >

        <div className="poster-container">

          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster"
          />


          {movie.premium && (

            <span className="gold-badge">
              ⭐ GOLD
            </span>

          )}

        </div>


        <div className="movie-info">

          <h3>
            {movie.title}
          </h3>


          <p className="movie-genre">
            {movie.genre}
          </p>


          <Link
            to={`/movies/${movie.id}/watch`}
            className="details-button"
          >
            View Details
          </Link>

        </div>

      </div>
    );

  };


  return (

    <div className="movies-page">

      <div className="movies-header">

        <h1>🎬 Movies</h1>

        <p>
          Discover movies and watch their trailers.
        </p>


        <div className="movie-filters">

          <input
            type="text"
            placeholder="🔍 Search movies..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />


          <div className="filter-row">

            <select
              className="genre-filter"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >

              <option value="">
                All Genres
              </option>

              {availableGenres.map((genre) => (

                <option
                  key={genre}
                  value={genre}
                >
                  {genre}
                </option>

              ))}

            </select>


            <select
              className="year-filter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >

              <option value="">
                All Years
              </option>

              {availableYears.map((year) => (

                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>

              ))}

            </select>


            <button
              className="clear-filters"
              onClick={() => {
                setSearchTerm("");
                setSelectedGenre("");
                setSelectedYear("");
              }}
            >
              Clear Filters
            </button>

          </div>

        </div>

      </div>


      <div className="movie-categories">


        {isFiltering ? (

          <section className="movie-category">

            <div className="category-header">

              <h2>
                🔍 Search Results
              </h2>

              <span>
                {filteredMovies.length} Movies
              </span>

            </div>


            <div className="movie-row">

              {filteredMovies.length === 0 ? (

                <p className="no-movies">
                  No movies found.
                </p>

              ) : (

                filteredMovies.map((movie) =>
                  renderMovieCard(movie, "search-results")
                )

              )}

            </div>

          </section>

        ) : (


          <>


            {popularMovies.length > 0 && (

              <section className="movie-category">

                <div className="category-header">

                  <h2>
                    🔥 Popular Movies
                  </h2>

                  <span>
                    {popularMovies.length} Movies
                  </span>

                </div>


                <div className="movie-row">

                  {popularMovies.map((movie) =>
                    renderMovieCard(movie, "popular")
                  )}

                </div>

              </section>

            )}


            {goldMovies.length > 0 && (

              <section className="movie-category">

                <div className="category-header">

                  <h2>
                    ⭐ Gold Movies
                  </h2>

                  <span>
                    {goldMovies.length} Movies
                  </span>

                </div>


                <div className="movie-row">

                  {goldMovies.map((movie) =>
                    renderMovieCard(movie, "gold")
                  )}

                </div>

              </section>

            )}


            {freeMovies.length > 0 && (

              <section className="movie-category">

                <div className="category-header">

                  <h2>
                    🎬 Free Movies
                  </h2>

                  <span>
                    {freeMovies.length} Movies
                  </span>

                </div>


                <div className="movie-row">

                  {freeMovies.map((movie) =>
                    renderMovieCard(movie, "free")
                  )}

                </div>

              </section>

            )}


            {genreCategories.map((category) => (

              <section
                className="movie-category"
                key={category.genre}
              >

                <div className="category-header">

                  <h2>
                    {category.title}
                  </h2>

                  <span>
                    {category.movies.length} Movies
                  </span>

                </div>


                <div className="movie-row">

                  {category.movies.map((movie) =>
                    renderMovieCard(
                      movie,
                      `genre-${category.genre}`
                    )
                  )}

                </div>

              </section>

            ))}

          </>

        )}

      </div>

    </div>

  );
}

export default Movies;