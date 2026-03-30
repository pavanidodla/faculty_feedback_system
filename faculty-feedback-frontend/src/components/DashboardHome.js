import React, { useEffect, useState } from "react";
import API from "../services/api";

const DashboardHome = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [campusFilter, setCampusFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchLeaderboard();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const getPerformanceStyle = (rating) => {
    const num = Number(rating);

    if (num >= 4.5) return { label: "Excellent", color: "#16a34a" };
    if (num >= 4) return { label: "Very Good", color: "#2563eb" };
    if (num >= 3) return { label: "Average", color: "#d97706" };
    return { label: "Poor", color: "#dc2626" };
  };

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

  return (
    <div style={styles.page(isMobile)}>
      <h1 style={styles.heading(isMobile)}>Faculty Feedback Dashboard</h1>

      {/* Filters */}
      <div style={styles.filterBox(isMobile)}>
        <input
          placeholder="🔍 Search Faculty"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input(isMobile)}
        />

        <select
          value={campusFilter}
          onChange={(e) => setCampusFilter(e.target.value)}
          style={styles.input(isMobile)}
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
          style={styles.input(isMobile)}
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

        <button onClick={downloadCSV} style={styles.downloadBtn(isMobile)}>
          ⬇ Download CSV
        </button>
      </div>

      {/* Faculty Cards */}
      {filteredData.map((fac, idx) => (
        <div key={idx} style={styles.facultyCard(isMobile)}>
          <h2>{fac.faculty}</h2>

          {Object.entries(fac.campuses || {}).map(([campus, branches]) => (
            <div key={campus} style={styles.campusBox}>
              <h3>🏫 {campus}</h3>

              {Object.entries(branches || {}).map(([branch, years]) => (
                <div key={branch}>
                  <h4>📘 {branch}</h4>

                  {/* Scroll wrapper for mobile */}
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.tableHeader}>
                          <th style={styles.th}>Year</th>
                          <th style={styles.th}>Rating</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Weak Area</th>
                          <th style={styles.th}>Responses</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Object.entries(years || {}).map(([year, data], i) => {
                          const perf = getPerformanceStyle(data?.rating);
                          return (
                            <tr key={i}>
                              <td style={styles.td}>{year}</td>
                              <td style={styles.td}>{data?.rating || "-"}</td>
                              <td style={styles.td}>
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
                              <td style={styles.td}>{data?.weakArea || "-"}</td>
                              <td style={styles.td}>{data?.responses || 0}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
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

const styles = {
  page: (mobile) => ({
    padding: mobile ? "10px" : "20px",
    fontFamily: "Segoe UI",
  }),

  heading: (mobile) => ({
    fontSize: mobile ? "22px" : "28px",
    marginBottom: "20px",
  }),

  filterBox: (mobile) => ({
    display: "flex",
    flexDirection: mobile ? "column" : "row",
    gap: "10px",
    marginBottom: "20px",
  }),

  input: (mobile) => ({
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: mobile ? "100%" : "auto",
  }),

  downloadBtn: (mobile) => ({
    background: "#16a34a",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    width: mobile ? "100%" : "auto",
  }),

  facultyCard: (mobile) => ({
    background: "#f8fafc",
    padding: mobile ? "15px" : "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  }),

  campusBox: {
    marginTop: "15px",
    padding: "10px",
    background: "#eef2ff",
    borderRadius: "8px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "8px",
    minWidth: "500px",
  },

  tableHeader: {
    background: "#0ea5e9",
    color: "#fff",
  },

  th: {
    padding: "8px",
    textAlign: "left",
  },

  td: {
    padding: "8px",
    borderBottom: "1px solid #e5e7eb",
  },
};

export default DashboardHome;
