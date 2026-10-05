import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  // Get logged-in user from localStorage initially
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );


  // =================================================
  // GET LATEST USER DETAILS FROM BACKEND
  // =================================================

  useEffect(() => {

    const fetchCurrentUser = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {

        const response = await axios.get(
          "http://localhost:8080/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Update React state
        setUser(response.data);

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );

      } catch (error) {

        console.error(
          "Error fetching current user:",
          error
        );

      }

    };

    fetchCurrentUser();

  }, [location.pathname]);


  // =================================================
  // LISTEN FOR USER / MEMBERSHIP UPDATES
  // =================================================

  useEffect(() => {

    const handleUserUpdated = () => {

      const updatedUser = JSON.parse(
        localStorage.getItem("user")
      );

      setUser(updatedUser);

    };

    window.addEventListener(
      "userUpdated",
      handleUserUpdated
    );

    return () => {

      window.removeEventListener(
        "userUpdated",
        handleUserUpdated
      );

    };

  }, []);


  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

  };


  // =================================================
  // CHECK ACTIVE PAGE
  // =================================================

  const isActive = (path) => {

    return location.pathname === path;

  };


  // =================================================
  // JSX
  // =================================================

  return (

    <nav className="navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="logo">

        <Link to="/">

          <span className="logo-icon">
            🎬
          </span>

          <span className="logo-text">
            Movie<span>Stream</span>
          </span>

        </Link>

      </div>


      {/* =================================================
          NAVIGATION
      ================================================= */}

      <div className="nav-links">

        <Link
          to="/"
          className={
            isActive("/")
              ? "active-nav"
              : ""
          }
        >
          Home
        </Link>


        <Link
          to="/movies"
          className={
            isActive("/movies")
              ? "active-nav"
              : ""
          }
        >
          Movies
        </Link>


        <Link
          to="/gold"
          className={`gold-link ${
            isActive("/gold")
              ? "active-nav"
              : ""
          }`}
        >
          ⭐ Gold
        </Link>


        {/* =================================================
            LOGGED IN USER
        ================================================= */}

        {user ? (

          <>

            <div className="user-membership">

              <span className="user-icon">
                👤
              </span>


              <div className="user-details">

                <span className="user-name">
                  {user.name}
                </span>


                <span
                  className={
                    user.membership === "GOLD"
                      ? "membership-gold"
                      : "membership-free"
                  }
                >
                  {user.membership}
                </span>

              </div>

            </div>


            {/* =================================================
                LOGOUT BUTTON
            ================================================= */}

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>

          </>

        ) : (

          /* =================================================
             NOT LOGGED IN
          ================================================= */

          <Link
            to="/login"
            className="login-nav-button"
          >
            Login
          </Link>

        )}

      </div>

    </nav>

  );
}

export default Navbar;