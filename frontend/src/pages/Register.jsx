import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Name validation
    if (!name.trim()) {
      setError("Name cannot be blank.");
      return;
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one digit and one special character."
      );
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {

      await axios.post(
        "http://localhost:8080/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        }
      );

      setSuccess("Account created successfully!");

      // Go to login page after registration
      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      console.error("Registration error:", error);

      // Backend validation errors
      if (error.response?.data) {

        const validationErrors =
          error.response.data;

        if (typeof validationErrors === "object") {

          const messages =
            Object.values(validationErrors);

          if (messages.length > 0) {
            setError(messages.join(" "));
            return;
          }
        }

        // Normal backend message
        if (typeof validationErrors === "string") {
          setError(validationErrors);
          return;
        }

        if (validationErrors.message) {
          setError(validationErrors.message);
          return;
        }
      }

      setError(
        "Registration failed. Please try again."
      );
    }
  };


  return (
    <div className="auth-page">

      <div className="auth-container register-container">

        <div className="auth-logo">
          🎬
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join MovieStream and start watching amazing trailers.
        </p>


        <form onSubmit={handleSubmit}>

          {/* Name */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>


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
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <small>
              Minimum 8 characters with uppercase, lowercase,
              number and special character.
            </small>

          </div>


          {/* Confirm Password */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
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


          {/* Success */}

          {success && (
            <p style={{ color: "green" }}>
              {success}
            </p>
          )}


          {/* Register Button */}

          <button
            type="submit"
            className="auth-button"
          >
            Create Account
          </button>

        </form>


        {/* Login */}

        <div className="auth-footer">

          <p>
            Already have an account?
          </p>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;