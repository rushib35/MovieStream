import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./WatchTrailer.css";

function WatchTrailer() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [access, setAccess] = useState(null);


  // =========================
  // FETCH MOVIE + CHECK ACCESS
  // =========================

  useEffect(() => {

    const token = localStorage.getItem("token");

    // User is not logged in
    if (!token) {
      navigate("/login");
      return;
    }


    // Fetch movie details
    axios
      .get(`http://localhost:8080/movies/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      .then((response) => {

        setMovie(response.data);

        // Check whether user can watch
        return axios.get(
          `http://localhost:8080/movies/${id}/watch`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      })

      .then((response) => {

        // Backend allowed access
        setAccess({
          allowed: true,
          videoUrl: response.data
        });

        setLoading(false);

      })

      .catch((error) => {

        // 403 is expected when FREE user
        // tries to watch GOLD content
        if (error.response?.status === 403) {

          setAccess({
            allowed: false,
            message: error.response.data
          });

          setLoading(false);

          return;
        }


        // Other API errors are real errors
        console.error(
          "Error fetching movie/access:",
          error
        );

        setError(true);
        setLoading(false);

      });

  }, [id, navigate]);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="watch-page">

        <div className="not-found-container">

          <h1>
            Loading Movie...
          </h1>

          <p>
            Please wait while we load the movie.
          </p>

        </div>

      </div>
    );
  }


  // =========================
  // MOVIE NOT FOUND
  // =========================

  if (error || !movie) {

    return (
      <div className="watch-page">

        <div className="not-found-container">

          <h1>
            Movie Not Found
          </h1>

          <p>
            The movie you are looking for does not exist.
          </p>

          <Link
            to="/movies"
            className="back-button"
          >
            ← Back to Movies
          </Link>

        </div>

      </div>
    );
  }


  // =========================
  // PREMIUM MOVIE + NO ACCESS
  // =========================

  if (
    movie.premium &&
    access &&
    !access.allowed
  ) {

    return (
      <div className="watch-page">

        <div className="upgrade-container">

          <div className="lock-icon">
            🔒
          </div>


          <div className="gold-content-badge">
            ⭐ GOLD CONTENT
          </div>


          <h1>
            Unlock This Trailer
          </h1>


          <p>
            {access.message}
          </p>


          <div className="upgrade-buttons">

            <Link
              to="/gold"
              className="upgrade-button"
            >
              ⭐ Upgrade to Gold
            </Link>


            <Link
              to="/movies"
              className="back-button"
            >
              ← Back to Movies
            </Link>

          </div>

        </div>

      </div>
    );
  }


  // =========================
  // ALLOWED TO WATCH
  // =========================

  return (
    <div className="watch-page">

      <div className="watch-container">

        <h1>
          {movie.title}
        </h1>


        {movie.premium && (
          <div className="gold-label">
            ⭐ GOLD
          </div>
        )}


        <p className="watch-genre">
          {movie.genre}
        </p>


        <div className="video-container">

          <iframe
            src={access.videoUrl}
            title={`${movie.title} Trailer`}
            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture
            "
            allowFullScreen
          ></iframe>

        </div>


        <p className="watch-description">
          {movie.description}
        </p>


        <Link
          to="/movies"
          className="back-button"
        >
          ← Back to Movies
        </Link>

      </div>

    </div>
  );
}

export default WatchTrailer;