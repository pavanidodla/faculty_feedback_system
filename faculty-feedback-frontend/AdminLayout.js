import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "" },
    { name: "Manage Subjects", path: "subjects" },
    { name: "View Feedback", path: "feedback" },
    { name: "Export Data", path: "export" }
  ];

  return (
    <div style={{ display: "flex" }}>
      
      {/* MOBILE TOGGLE BUTTON */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: "fixed",
          top: "15px",
          left: "15px",
          zIndex: 1000,
          background: "#1e293b",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
        className="menu-btn"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div
        style={{
          width: "230px",
          height: "100vh",
          background: "#1e293b",
          padding: "20px",
          position: "fixed",
          left: sidebarOpen ? "0" : "-240px",
          top: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "0.3s",
          zIndex: 999
        }}
        className="sidebar"
      >
        {/* MENU */}
        <div>
          <h2 style={{ color: "white", marginBottom: "30px" }}>
            Admin Panel
          </h2>

          {menuItems.map((item, index) => {
            const isActive =
              location.pathname === `/admin-dashboard/${item.path}` ||
              (item.path === "" &&
                location.pathname === "/admin-dashboard");

            return (
              <div key={index} style={{ marginBottom: "15px" }}>
                <Link
                  to={
                    item.path === ""
                      ? "/admin-dashboard"
                      : `/admin-dashboard/${item.path}`
                  }
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor: isActive ? "#38bdf8" : "transparent",
                    color: isActive ? "#1e293b" : "white",
                    textDecoration: "none",
                    fontWeight: isActive ? "bold" : "normal"
                  }}
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
        </div>

        {/* LOGOUT */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f1f5f9",
          minHeight: "100vh",
          marginLeft: "0"
        }}
        className="content"
      >
        <Outlet />
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            left: 0 !important;
          }

          .content {
            margin-left: 230px;
          }

          .menu-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}