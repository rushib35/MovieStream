import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import WatchTrailer from "./pages/WatchTrailer";
import GoldMembership from "./pages/GoldMembership";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import AdminMovies from "./pages/AdminMovies";
import AdminUsers from "./pages/AdminUsers";
import AdminMemberships from "./pages/AdminMemberships";
import CreateAdmin from "./pages/CreateAdmin";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Home />} />

        <Route path="/movies" element={<Movies />} />

        <Route
          path="/movies/:id"
          element={<MovieDetails />}
        />

        <Route
          path="/movies/:id/watch"
          element={<WatchTrailer />}
        />

        <Route
          path="/gold"
          element={<GoldMembership />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Protected Admin Routes */}

        <Route element={<AdminProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/movies"
            element={<AdminMovies />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/memberships"
            element={<AdminMemberships />}
          />

          <Route
            path="/admin/create-admin"
            element={<CreateAdmin />}
          />

        </Route>

      </Routes>

      <Footer />
    </>
  );
}

export default App;