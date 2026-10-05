import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateAdmin.css";

function CreateAdmin() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    // Name validation
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
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

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/users/create-admin",
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setSuccess(
        "Admin account created successfully!"
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {

      console.error(
        "Create admin error:",
        error
      );

      if (error.response?.data) {

        if (typeof error.response.data === "string") {

          setError(error.response.data);

        } else if (error.response.data.message) {

          setError(error.response.data.message);

        } else {

          setError(
            "Unable to create admin account."
          );
        }

      } else {

        setError(
          "Unable to create admin account. Please try again."
        );
      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="create-admin-page">

      <div className="create-admin-container">

        {/* Header */}

        <div className="create-admin-header">

          <div className="create-admin-icon">
            👑
          </div>

          <h1>
            Create Admin
          </h1>

          <p>
            Create a new MovieStream administrator account.
          </p>

        </div>

        {/* Form */}

        <form onSubmit={handleSubmit}>

          {/* Name */}

          <div className="admin-form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <input
              type="text"
              id="name"
              placeholder="Enter full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </div>

          {/* Email */}

          <div className="admin-form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </div>

          {/* Password */}

          <div className="admin-form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              placeholder="Create admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <small>
              Minimum 8 characters with uppercase,
              lowercase, number and special character.
            </small>

          </div>

          {/* Error */}

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="admin-success">
              {success}
            </div>
          )}

          {/* Create Button */}

          <button
            type="submit"
            className="create-admin-button"
            disabled={loading}
          >

            {loading
              ? "Creating Admin..."
              : "👑 Create Admin"}

          </button>

          {/* Back Button */}

          <button
            type="button"
            className="back-admin-button"
            onClick={() =>
              navigate("/admin")
            }
          >
            ← Back to Dashboard
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateAdmin;