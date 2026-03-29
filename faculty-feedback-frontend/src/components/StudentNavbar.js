import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Faculty Feedback System</h2>

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/feedback" style={styles.link}>Give Feedback</Link>
        <Link to="/view-feedback" style={styles.link}>View Feedback</Link>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: "70px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  logo: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#4f46e5"
  },
  links: {
    display: "flex",
    gap: "25px",
    alignItems: "center"
  },
  link: {
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    color: "#374151",
    transition: "0.3s"
  },
  logout: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
  }
};
