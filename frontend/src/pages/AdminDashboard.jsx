import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {

  const navigate = useNavigate();

  const [movieCount, setMovieCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [goldMemberCount, setGoldMemberCount] = useState(0);
  const [freeMovieCount, setFreeMovieCount] = useState(0);
  const [premiumMovieCount, setPremiumMovieCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`
        };

        const movieResponse = await axios.get(
          "http://localhost:8080/movies",
          { headers }
        );

        const userResponse = await axios.get(
          "http://localhost:8080/users",
          { headers }
        );

        const movies = movieResponse.data;
        const users = userResponse.data;

        setMovieCount(movies.length);

        setUserCount(users.length);

        const goldMembers = users.filter(
          (user) => user.membership === "GOLD"
        );

        setGoldMemberCount(goldMembers.length);

        const freeMovies = movies.filter(
          (movie) => movie.premium === false
        );

        setFreeMovieCount(freeMovies.length);

        const premiumMovies = movies.filter(
          (movie) => movie.premium === true
        );

        setPremiumMovieCount(premiumMovies.length);

      } catch (error) {

        console.error(
          "Error fetching dashboard data:",
          error
        );

      } finally {

        setLoading(false);

      }
    };

    fetchDashboardData();

  }, []);

  // Admin logout
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {

    return (
      <div className="admin-dashboard">

        <div className="admin-content">

          <h1>
            Loading dashboard...
          </h1>

        </div>

      </div>
    );
  }

  return (

    <div className="admin-dashboard">

      {/* Sidebar */}

      <div className="admin-sidebar">

        <h2>
          🎬 MovieStream
        </h2>

        <p className="admin-title">
          Admin Panel
        </p>

        <ul>

          <li>
            <Link to="/admin">
              📊 Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/movies">
              🎬 Movies
            </Link>
          </li>

          <li>
            <Link to="/admin/users">
              👥 Users
            </Link>
          </li>

          <li>
            <Link to="/admin/memberships">
              ⭐ Memberships
            </Link>
          </li>

          {/* Create Admin */}

          <li>
            <Link to="/admin/create-admin">
              👑 Create Admin
            </Link>
          </li>

        </ul>

        {/* Logout Button */}

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

      {/* Main Content */}

      <div className="admin-content">

        <h1>
          Admin Dashboard
        </h1>

        <p>
          Welcome to MovieStream Admin Panel
        </p>

        {/* Statistics Cards */}

        <div className="admin-cards">

          <div className="admin-card">

            <h3>
              🎬 Movies
            </h3>

            <h2>
              {movieCount}
            </h2>

            <p>
              Total Movies
            </p>

          </div>

          <div className="admin-card">

            <h3>
              👥 Users
            </h3>

            <h2>
              {userCount}
            </h2>

            <p>
              Total Users
            </p>

          </div>

          <div className="admin-card">

            <h3>
              ⭐ Gold Members
            </h3>

            <h2>
              {goldMemberCount}
            </h2>

            <p>
              Gold Members
            </p>

          </div>

          <div className="admin-card">

            <h3>
              🎥 Free Movies
            </h3>

            <h2>
              {freeMovieCount}
            </h2>

            <p>
              Free Movies
            </p>

          </div>

          <div className="admin-card">

            <h3>
              👑 Premium Movies
            </h3>

            <h2>
              {premiumMovieCount}
            </h2>

            <p>
              Premium Movies
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;