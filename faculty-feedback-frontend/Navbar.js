import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>🎓 Faculty Feedback</h2>

        {/* Hamburger */}
        <div
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        <div
          style={{
            ...styles.links,
            ...(menuOpen && styles.mobileLinksOpen),
          }}
        >
          <button
            onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
            style={{
              ...styles.btn,
              ...(isActive("/dashboard") && styles.active),
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => { navigate("/feedback"); setMenuOpen(false); }}
            style={{
              ...styles.btn,
              ...(isActive("/feedback") && styles.active),
            }}
          >
            Give Feedback
          </button>

          <button
            onClick={() => { navigate("/view-feedback"); setMenuOpen(false); }}
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

      <style>{`
        @media(max-width: 768px){

          .links{
            position:absolute;
            top:60px;
            left:0;
            right:0;
            background:linear-gradient(90deg, #4f46e5, #7c3aed);
            flex-direction:column;
            padding:15px;
            gap:10px;
            display:none;
          }

          .links.open{
            display:flex;
          }
        }
      `}</style>
    </>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
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

  mobileLinksOpen: {
    display: "flex",
    position: "absolute",
    top: "60px",
    left: 0,
    right: 0,
    flexDirection: "column",
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    padding: "15px",
    gap: "10px",
  },

  hamburger: {
    display: "none",
    fontSize: "24px",
    cursor: "pointer",
  },

  btn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: "8px",
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
  },
};