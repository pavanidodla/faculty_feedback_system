import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FeedbackForm from "./pages/FeedbackForm";
import ViewFeedback from "./pages/viewFeedback";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= STUDENT ROUTES ================= */}
        <Route
          element={
            <ProtectedRoute role="student">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/view-feedback" element={<ViewFeedback />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
