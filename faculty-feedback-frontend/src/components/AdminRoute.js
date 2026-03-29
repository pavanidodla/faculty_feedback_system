import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Logged in but not admin → go to student dashboard
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin → allow access
  return children;
}