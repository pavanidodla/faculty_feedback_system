import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="menuBtn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="title">Admin Panel</h2>

        <NavLink to="/" end className="link" onClick={() => setOpen(false)}>
          Dashboard
        </NavLink>

        <NavLink to="/subjects" className="link" onClick={() => setOpen(false)}>
          Manage Subjects
        </NavLink>

        <NavLink to="/feedback" className="link" onClick={() => setOpen(false)}>
          View Feedback
        </NavLink>

        <NavLink to="/export" className="link" onClick={() => setOpen(false)}>
          Export Data
        </NavLink>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <style>{`
        .menuBtn{
          position:fixed;
          top:12px;
          left:12px;
          background:#1e293b;
          color:white;
          border:none;
          padding:8px 12px;
          border-radius:6px;
          cursor:pointer;
          z-index:1000;
        }

        .sidebar{
          position:fixed;
          top:0;
          left:-240px;
          width:220px;
          height:100vh;
          background:#1e293b;
          color:white;
          padding:20px;
          transition:0.3s;
          z-index:999;
        }

        .sidebar.open{
          left:0;
        }

        .title{
          margin-bottom:20px;
        }

        .link{
          display:block;
          color:white;
          text-decoration:none;
          padding:10px;
          margin-bottom:10px;
          border-radius:6px;
        }

        .link.active{
          background:#38bdf8;
          color:#1e293b;
          font-weight:bold;
        }

        .logout{
          width:100%;
          padding:10px;
          background:#dc2626;
          color:white;
          border:none;
          border-radius:6px;
          margin-top:10px;
          cursor:pointer;
        }

        /* Desktop: Sidebar always visible */
        @media(min-width: 768px){
          .sidebar{
            left:0;
          }

          .menuBtn{
            display:none;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
