import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>🎓 Faculty Feedback</h2>

      <div style={styles.links}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            ...styles.btn,
            ...(isActive("/dashboard") && styles.active),
          }}
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/feedback")}
          style={{
            ...styles.btn,
            ...(isActive("/feedback") && styles.active),
          }}
        >
          Give Feedback
        </button>

        <button
          onClick={() => navigate("/view-feedback")}
          style={{
            ...styles.btn,
            ...(isActive("/view-feedback") && styles.active),
          }}
        >
          View Feedback
        </button>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding:"7px",
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    color: "white",
  },

  logo: {
    fontWeight: "700",
    letterSpacing: "1px",
  },

  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },

  btn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
  },

  active: {
    background: "rgba(255,255,255,0.2)",
  },

  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
};