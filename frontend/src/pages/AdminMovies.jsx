import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMovies.css";

function AdminMovies() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    genre: "",
    posterUrl: "",
    videoUrl: "",
    releaseYear: "",
    price: "",
    premium: false
  });


  // Fetch all movies

  const fetchMovies = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/movies",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMovies(response.data);

    } catch (error) {

      console.error("Error fetching movies:", error);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchMovies();

  }, []);


  // Handle form input

  const handleChange = (event) => {

    const { name, value, type, checked } = event.target;

    setMovie({
      ...movie,
      [name]: type === "checkbox" ? checked : value
    });

  };


  // Open Add Movie form

  const handleAddMovie = () => {

    setEditMode(false);
    setEditingMovieId(null);

    setMovie({
      title: "",
      description: "",
      genre: "",
      posterUrl: "",
      videoUrl: "",
      releaseYear: "",
      price: "",
      premium: false
    });

    setShowForm(true);
  };


  // Open Edit Movie form

  const handleEditMovie = (selectedMovie) => {

    setEditMode(true);
    setEditingMovieId(selectedMovie.id);

    setMovie({
      title: selectedMovie.title || "",
      description: selectedMovie.description || "",
      genre: selectedMovie.genre || "",
      posterUrl: selectedMovie.posterUrl || "",
      videoUrl: selectedMovie.videoUrl || "",
      releaseYear: selectedMovie.releaseYear || "",
      price: selectedMovie.price || "",
      premium: selectedMovie.premium || false
    });

    setShowForm(true);
  };


  // Save or Update movie

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const movieData = {
        ...movie,
        releaseYear: Number(movie.releaseYear),
        price: Number(movie.price)
      };


      // UPDATE

      if (editMode) {

        await axios.put(
          `http://localhost:8080/movies/${editingMovieId}`,
          movieData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        alert("Movie updated successfully!");

      }


      // ADD

      else {

        await axios.post(
          "http://localhost:8080/movies",
          movieData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        alert("Movie added successfully!");

      }


      // Reset form

      setMovie({
        title: "",
        description: "",
        genre: "",
        posterUrl: "",
        videoUrl: "",
        releaseYear: "",
        price: "",
        premium: false
      });

      setShowForm(false);
      setEditMode(false);
      setEditingMovieId(null);

      fetchMovies();

    } catch (error) {

      console.error("Error saving movie:", error);

      alert(
        editMode
          ? "Failed to update movie."
          : "Failed to add movie."
      );

    }

  };


  // Delete movie

  const handleDeleteMovie = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8080/movies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Movie deleted successfully!");

      fetchMovies();

    } catch (error) {

      console.error("Error deleting movie:", error);

      alert("Failed to delete movie.");

    }

  };


  // Cancel form

  const handleCancel = () => {

    setShowForm(false);
    setEditMode(false);
    setEditingMovieId(null);

    setMovie({
      title: "",
      description: "",
      genre: "",
      posterUrl: "",
      videoUrl: "",
      releaseYear: "",
      price: "",
      premium: false
    });

  };


  if (loading) {
    return <h2>Loading movies...</h2>;
  }


  return (
    <div className="admin-movies">


      {/* Header */}

      <div className="admin-movies-header">

        <div>

          <h1>🎬 Manage Movies</h1>

          <p>
            Add, update and delete movies from MovieStream.
          </p>

        </div>


        <button
          className="add-movie-btn"
          onClick={handleAddMovie}
        >
          + Add Movie
        </button>

      </div>


      {/* Add / Edit Movie Form */}

      {showForm && (

        <form
          className="add-movie-form"
          onSubmit={handleSubmit}
        >

          <h2>
            {editMode
              ? "✏️ Edit Movie"
              : "➕ Add New Movie"}
          </h2>


          <input
            type="text"
            name="title"
            placeholder="Movie Title"
            value={movie.title}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="description"
            placeholder="Description"
            value={movie.description}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={movie.genre}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="posterUrl"
            placeholder="Poster URL"
            value={movie.posterUrl}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            name="videoUrl"
            placeholder="Video URL"
            value={movie.videoUrl}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="releaseYear"
            placeholder="Release Year"
            value={movie.releaseYear}
            onChange={handleChange}
            required
          />


          <input
            type="number"
            name="price"
            placeholder="Price"
            value={movie.price}
            onChange={handleChange}
            required
          />


          <label className="premium-checkbox">

            <input
              type="checkbox"
              name="premium"
              checked={movie.premium}
              onChange={handleChange}
            />

            Premium Movie

          </label>


          <div className="form-buttons">

            <button
              type="submit"
              className="save-movie-btn"
            >
              {editMode
                ? "Update Movie"
                : "Save Movie"}
            </button>


            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>

          </div>

        </form>

      )}


      {/* Movies Table */}

      <div className="movies-table-container">

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Title</th>
              <th>Genre</th>
              <th>Year</th>
              <th>Type</th>
              <th>Actions</th>

            </tr>

          </thead>


          <tbody>

            {movies.length === 0 ? (

              <tr>

                <td colSpan="6">
                  No movies found.
                </td>

              </tr>

            ) : (

              movies.map((movie) => (

                <tr key={movie.id}>

                  <td>
                    {movie.id}
                  </td>

                  <td>
                    {movie.title}
                  </td>

                  <td>
                    {movie.genre}
                  </td>

                  <td>
                    {movie.releaseYear}
                  </td>

                  <td>
                    {movie.premium
                      ? "⭐ Gold"
                      : "🎬 Free"}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditMovie(movie)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteMovie(movie.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminMovies;