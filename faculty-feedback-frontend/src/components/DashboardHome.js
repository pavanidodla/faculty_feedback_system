import React, { useEffect, useState } from "react";
import API from "../services/api";

const DashboardHome = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [campusFilter, setCampusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [emailStatus, setEmailStatus] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leaderboard, campusFilter, branchFilter, search]);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/ranking/leaderboard");
      setLeaderboard(res.data || []);
    } catch (err) {
      console.error("Error fetching leaderboard", err);
    }
  };

  /* ===================== EMAIL FUNCTION ===================== */

  const sendEmails = async () => {
    try {
      setEmailStatus("Sending emails...");
      const res = await API.post("/admin/send-feedback-link");
      setEmailStatus(res.data.message || "Emails sent successfully");
    } catch (err) {
      console.error(err);
      setEmailStatus("Failed to send emails");
    }
  };

  /* ===================== FILTERING ===================== */

  const applyFilters = () => {
    let data = [...leaderboard];

    if (search) {
      data = data.filter((f) =>
        f.faculty.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (campusFilter !== "All") {
      data = data.map((fac) => ({
        ...fac,
        campuses: {
          [campusFilter]: fac.campuses?.[campusFilter],
        },
      }));
    }

    if (branchFilter !== "All") {
      data = data.map((fac) => {
        const updatedCampuses = {};
        Object.entries(fac.campuses || {}).forEach(([campus, branches]) => {
          updatedCampuses[campus] = {
            [branchFilter]: branches?.[branchFilter],
          };
        });
        return { ...fac, campuses: updatedCampuses };
      });
    }

    setFilteredData(data);
  };

  /* ===================== PERFORMANCE LABEL ===================== */

  const getPerformanceStyle = (rating) => {
    const num = Number(rating);

    if (num >= 4.5) {
      return { label: "Excellent", color: "#16a34a" };
    } else if (num >= 4) {
      return { label: "Very Good", color: "#2563eb" };
    } else if (num >= 3) {
      return { label: "Average", color: "#d97706" };
    } else {
      return { label: "Poor", color: "#dc2626" };
    }
  };

  /* ===================== DOWNLOAD CSV ===================== */

  const downloadCSV = () => {
    let rows = [
      [
        "Faculty",
        "Campus",
        "Branch",
        "Year",
        "Rating",
        "Status",
        "Weak Area",
        "Responses",
      ],
    ];

    filteredData.forEach((fac) => {
      Object.entries(fac.campuses || {}).forEach(([campus, branches]) => {
        Object.entries(branches || {}).forEach(([branch, years]) => {
          Object.entries(years || {}).forEach(([year, data]) => {
            const perf = getPerformanceStyle(data?.rating);

            rows.push([
              fac.faculty,
              campus,
              branch,
              year,
              data?.rating || "-",
              perf.label,
              data?.weakArea || "-",
              data?.responses || 0,
            ]);
          });
        });
      });
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "faculty_feedback.csv";
    link.click();
  };

  /* ===================== UI ===================== */

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI", marginLeft: "240px" }}>
      <h1 style={{ marginBottom: "20px" }}>Faculty Feedback Dashboard</h1>

      {/* Filters */}
      <div style={filterBox}>
        <input
          placeholder="🔍 Search Faculty"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={input}
        />

        <select
          value={campusFilter}
          onChange={(e) => setCampusFilter(e.target.value)}
          style={input}
        >
          <option>All</option>
          <option>RK Valley</option>
          <option>Ongole</option>
          <option>Nuzvid</option>
          <option>Srikakulam</option>
        </select>

        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          style={input}
        >
          <option>All</option>
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>CIVIL</option>
          <option>MECH</option>
          <option>CHEMICAL</option>
          <option>MME</option>
        </select>

        <button onClick={downloadCSV} style={downloadBtn}>
          ⬇ Download CSV
        </button>

        <button onClick={sendEmails} style={emailBtn}>
          ✉ Send Feedback Link
        </button>
      </div>

      {emailStatus && <p style={{ marginBottom: "10px" }}>{emailStatus}</p>}

      {/* Faculty Cards */}
      {filteredData.map((fac, idx) => (
        <div key={idx} style={facultyCard}>
          <h2 style={{ marginBottom: "10px" }}>{fac.faculty}</h2>

          {Object.entries(fac.campuses || {}).map(([campus, branches]) => (
            <div key={campus} style={campusBox}>
              <h3 style={{ color: "#1e3a8a" }}>🏫 {campus}</h3>

              {Object.entries(branches || {}).map(([branch, years]) => (
                <div key={branch}>
                  <h4 style={{ marginTop: "10px" }}>📘 {branch}</h4>

                  <table style={table}>
                    <thead>
                      <tr style={{ background: "#0ea5e9", color: "#fff" }}>
                        <th style={th}>Year</th>
                        <th style={th}>Rating</th>
                        <th style={th}>Status</th>
                        <th style={th}>Weak Area</th>
                        <th style={th}>Responses</th>
                      </tr>
                    </thead>

                    <tbody>
                      {Object.entries(years || {}).map(([year, data], i) => {
                        const perf = getPerformanceStyle(data?.rating);

                        return (
                          <tr key={i}>
                            <td style={td}>{year}</td>
                            <td style={td}>{data?.rating || "-"}</td>

                            <td style={td}>
                              <span
                                style={{
                                  background: perf.color,
                                  color: "#fff",
                                  padding: "4px 12px",
                                  borderRadius: "15px",
                                }}
                              >
                                {perf.label}
                              </span>
                            </td>

                            <td style={{ ...td, color: "#dc2626" }}>
                              {data?.weakArea || "-"}
                            </td>

                            <td style={td}>{data?.responses || 0}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ===================== STYLES ===================== */

const filterBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
};

const input = {
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const downloadBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const emailBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const facultyCard = {
  background: "#f8fafc",
  padding: "20px",
  marginBottom: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const campusBox = {
  marginTop: "15px",
  padding: "10px",
  background: "#eef2ff",
  borderRadius: "8px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "8px",
};

const th = {
  padding: "8px",
  textAlign: "left",
};

const td = {
  padding: "8px",
  borderBottom: "1px solid #e5e7eb",
};

export default DashboardHome;
