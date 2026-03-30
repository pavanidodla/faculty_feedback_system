import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function StudentNavbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Faculty Feedback System</h2>

      {/* Hamburger Button */}
      <button
        style={styles.menuBtn}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Links */}
      <div
        style={{
          ...styles.links,
          ...(open ? styles.linksOpen : {})
        }}
      >
        <Link to="/dashboard" style={styles.link} onClick={() => setOpen(false)}>
          Dashboard
        </Link>
        <Link to="/feedback" style={styles.link} onClick={() => setOpen(false)}>
          Give Feedback
        </Link>
        <Link to="/view-feedback" style={styles.link} onClick={() => setOpen(false)}>
          View Feedback
        </Link>

        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
        }
      `}</style>
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
    padding: "0 20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  logo: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#4f46e5"
  },
  menuBtn: {
    display: "none",
    fontSize: "22px",
    background: "none",
    border: "none",
    cursor: "pointer"
  },
  links: {
    display: "flex",
    gap: "25px",
    alignItems: "center"
  },
  linksOpen: {
    position: "absolute",
    top: "70px",
    left: 0,
    width: "100%",
    background: "#ffffff",
    flexDirection: "column",
    gap: "15px",
    padding: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
  },
  link: {
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    color: "#374151"
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
