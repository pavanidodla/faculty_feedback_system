import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

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
      
      {/* FIXED SIDEBAR */}
      <div
        style={{
          width: "230px",
          height: "100vh",
          background: "#1e293b",
          padding: "20px",
          position: "fixed",   // 🔥 makes sidebar fixed
          left: 0,
          top: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/* Top Menu */}
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

        {/* Logout Button (Slightly Above Bottom) */}
        <div style={{ marginBottom: "30px" }}>
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

      {/* PAGE CONTENT (shifted right because sidebar is fixed) */}
      <div
        style={{
          marginLeft: "260px",  // 🔥 important to avoid overlap
          flex: 1,
          padding: "30px",
          background: "#f1f5f9",
          minHeight: "100vh"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}