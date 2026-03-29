import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // redirect to login
  };

  return (
    <div style={sidebarStyle}>
      <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>

      <ul style={menuStyle}>
        <li>
          <NavLink to="/" end style={navLinkStyle}>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/subjects" style={navLinkStyle}>
            Manage Subjects
          </NavLink>
        </li>

        <li>
          <NavLink to="/feedback" style={navLinkStyle}>
            View Feedback
          </NavLink>
        </li>

        <li>
          <NavLink to="/export" style={navLinkStyle}>
            Export Data
          </NavLink>
        </li>

        {/* Logout Button */}
        <li>
          <button onClick={handleLogout} style={logoutBtn}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

/* Styles */

const sidebarStyle = {
  width: "220px",
  backgroundColor: "#1e293b",
  color: "white",
  height: "100vh",
  padding: "20px",
};

const menuStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const navLinkStyle = ({ isActive }) => ({
  display: "block",
  padding: "10px",
  marginBottom: "10px",
  textDecoration: "none",
  color: isActive ? "#1e293b" : "white",
  backgroundColor: isActive ? "#38bdf8" : "transparent",
  borderRadius: "6px",
  fontWeight: isActive ? "bold" : "normal",
  transition: "0.3s",
});

const logoutBtn = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px",
};

export default Sidebar;