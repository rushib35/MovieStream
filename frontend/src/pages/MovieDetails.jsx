import { Link, useParams } from "react-router-dom";
import "./MovieDetails.css";

function MovieDetails() {

  const { id } = useParams();

  const movies = [
    {
      id: 1,
      title: "The Last Journey",
      genre: "Adventure",
      description: "An exciting adventure filled with mystery and discovery.",
      posterUrl: "https://placehold.co/300x450/111827/ffffff?text=The+Last+Journey",
      isGold: false
    },
    {
      id: 2,
      title: "Dark Empire",
      genre: "Action",
      description: "A powerful action thriller about a mysterious empire.",
      posterUrl: "https://placehold.co/300x450/1e293b/facc15?text=Dark+Empire",
      isGold: true
    },
    {
      id: 3,
      title: "Love Forever",
      genre: "Romance",
      description: "A romantic story about love, friendship and destiny.",
      posterUrl: "https://placehold.co/300x450/831843/ffffff?text=Love+Forever",
      isGold: false
    },
    {
      id: 4,
      title: "The Secret",
      genre: "Mystery",
      description: "A mysterious story hiding a dangerous secret.",
      posterUrl: "https://placehold.co/300x450/312e81/ffffff?text=The+Secret",
      isGold: true
    },
    {
      id: 5,
      title: "Future World",
      genre: "Sci-Fi",
      description: "A journey into an unknown futuristic world.",
      posterUrl: "https://placehold.co/300x450/164e63/ffffff?text=Future+World",
      isGold: false
    },
    {
      id: 6,
      title: "Night Hunter",
      genre: "Thriller",
      description: "A detective searches for a mysterious criminal.",
      posterUrl: "https://placehold.co/300x450/18181b/facc15?text=Night+Hunter",
      isGold: true
    }
  ];

  const movie = movies.find(
    (movie) => movie.id === Number(id)
  );

  if (!movie) {
    return <h1>Movie Not Found</h1>;
  }

  return (
    <div className="movie-details-page">

      <div className="movie-details">

        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="details-poster"
        />

        <div className="details-content">

          {movie.isGold && (
            <span className="details-gold">
              ⭐ GOLD MOVIE
            </span>
          )}

          <h1>{movie.title}</h1>

          <h3>{movie.genre}</h3>

          <p>{movie.description}</p>

          <Link
            to={`/movies/${movie.id}/watch`}
            className="watch-trailer-btn"
          >
            🎬 Watch Trailer
          </Link>

        </div>

      </div>

    </div>
  );
}

export default MovieDetails;