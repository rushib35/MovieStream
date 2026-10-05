import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  // Admin
  return <Outlet />;
}

export default AdminProtectedRoute;