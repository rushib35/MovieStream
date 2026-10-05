import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    try {

      // Login
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email: email.trim(),
          password: password
        }
      );

      console.log("Login successful");

      // Save JWT token
      localStorage.setItem(
        "token",
        response.data.token
      );


      // Get logged-in user details
      const userResponse = await axios.get(
        "http://localhost:8080/users/me",
        {
          headers: {
            Authorization:
              `Bearer ${response.data.token}`
          }
        }
      );


      // Save user details
      localStorage.setItem(
        "user",
        JSON.stringify(userResponse.data)
      );


      // Check user role
      if (userResponse.data.role === "ADMIN") {

        // Admin goes directly to Admin Dashboard
        navigate("/admin");

      } else {

        // Normal user goes to Movies page
        navigate("/movies");

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      // Clear token if login fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setError(
        "Invalid email or password."
      );
    }
  };


  return (

    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-logo">
          🎬
        </div>


        <h1>Welcome Back</h1>


        <p className="auth-subtitle">
          Login to continue watching your favorite trailers.
        </p>


        <form onSubmit={handleSubmit}>


          {/* Email */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <div className="password-label">

              <label htmlFor="password">
                Password
              </label>

              {/* <Link to="#">
                Forgot password?
              </Link> */}

            </div>


            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>


          {/* Error */}

          {error && (

            <p style={{ color: "red" }}>
              {error}
            </p>

          )}


          {/* Login Button */}

          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>


        </form>


        {/* Register */}

        <div className="auth-footer">

          <p>
            Don't have an account?
          </p>

          <Link to="/register">
            Create Account
          </Link>

        </div>


      </div>

    </div>
  );
}

export default Login;