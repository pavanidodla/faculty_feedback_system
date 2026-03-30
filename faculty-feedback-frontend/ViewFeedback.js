import React, { useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState([]);
  const [filters, setFilters] = useState({
    campus: "All",
    branch: "All",
    year: "All",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await API.get("/feedback");
      setFeedbacks(res.data);
      setSummary(groupFacultyData(res.data));
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GROUPING LOGIC (unchanged) ================= */
  const groupFacultyData = (data) => {
    const facultyMap = {};
    data.forEach((fb) => {
      fb.feedbacks.forEach((item) => {
        const faculty = item.faculty;
        const key = `${item.subject}|${fb.branch}|${fb.year}`;

        if (!facultyMap[faculty]) facultyMap[faculty] = {};
        if (!facultyMap[faculty][key]) {
          facultyMap[faculty][key] = {
            subject: item.subject,
            branch: fb.branch,
            campus: fb.campus,
            year: fb.year,
            semester: fb.semester,
            students: new Set(),
            totalRating: 0,
            ratingCount: 0,
            positive: 0,
            neutral: 0,
            negative: 0,
          };
        }

        const entry = facultyMap[faculty][key];
        entry.students.add(fb.studentId);

        if (Array.isArray(item.ratings)) {
          entry.totalRating += item.ratings.reduce((a, b) => a + b, 0);
          entry.ratingCount += item.ratings.length;
        }

        if (item.sentiment === "Positive") entry.positive++;
        else if (item.sentiment === "Negative") entry.negative++;
        else entry.neutral++;
      });
    });

    return Object.keys(facultyMap).map((faculty) => ({
      faculty,
      rows: Object.values(facultyMap[faculty]).map((e) => {
        const studentCount = e.students.size;

        let overall = "Neutral";
        if (e.positive > e.negative && e.positive > e.neutral)
          overall = "Positive";
        else if (e.negative > e.positive && e.negative > e.neutral)
          overall = "Negative";

        return {
          ...e,
          studentCount,
          avgRating:
            e.ratingCount > 0
              ? (e.totalRating / e.ratingCount).toFixed(2)
              : "N/A",
          overallSentiment: overall,
        };
      }),
    }));
  };

  const applyFilters = (faculties) =>
    faculties.map((fac) => ({
      ...fac,
      rows: fac.rows.filter(
        (r) =>
          (filters.campus === "All" || r.campus === filters.campus) &&
          (filters.branch === "All" || r.branch === filters.branch) &&
          (filters.year === "All" || r.year === filters.year)
      ),
    }));

  const filteredSummary = applyFilters(summary);

  /* ================= EXCEL EXPORT (unchanged) ================= */
  const exportFacultySheets = () => {
    const workbook = XLSX.utils.book_new();

    filteredSummary.forEach((fac) => {
      const rows = fac.rows.map((r) => ({
        Subject: r.subject,
        Branch: r.branch,
        Campus: r.campus,
        Year: r.year,
        Semester: r.semester,
        Students: r.studentCount,
        AvgRating: r.avgRating,
        Positive: r.positive,
        Neutral: r.neutral,
        Negative: r.negative,
        Overall: r.overallSentiment,
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, fac.faculty);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer]),
      "Faculty_Wise_Feedback_Report.xlsx"
    );
  };

  if (loading) return <h3 style={styles.loading}>Loading feedback...</h3>;
  if (error) return <h3 style={styles.error}>{error}</h3>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📊 Faculty Feedback Dashboard</h2>

        {/* FILTERS */}
        <div style={styles.filters}>
          <select
            style={styles.select}
            onChange={(e) =>
              setFilters({ ...filters, campus: e.target.value })
            }
          >
            <option>All</option>
            <option>RK Valley</option>
            <option>Ongole</option>
          </select>

          <select
            style={styles.select}
            onChange={(e) =>
              setFilters({ ...filters, branch: e.target.value })
            }
          >
            <option>All</option>
            <option>CSE</option>
            <option>AI/ML</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>MECH</option>
            <option>CIVIL</option>
            <option>CHEMICAL</option>
            <option>MME</option>
          </select>

          <select
            style={styles.select}
            onChange={(e) =>
              setFilters({ ...filters, year: e.target.value })
            }
          >
            <option>All</option>
            <option>E1</option>
            <option>E2</option>
            <option>E3</option>
            <option>E4</option>
          </select>

          <button style={styles.exportBtn} onClick={exportFacultySheets}>
            📥 Export Excel
          </button>
        </div>

        {/* TABLES */}
        {filteredSummary.map((fac, i) => (
          <div key={i} style={styles.facultyCard}>
            <h3 style={styles.facultyTitle}>👨‍🏫 {fac.faculty}</h3>

            {/* SCROLL WRAPPER */}
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Branch</th>
                    <th style={styles.th}>Campus</th>
                    <th style={styles.th}>Year</th>
                    <th style={styles.th}>Students</th>
                    <th style={styles.th}>Avg Rating</th>
                    <th style={styles.th}>Positive</th>
                    <th style={styles.th}>Neutral</th>
                    <th style={styles.th}>Negative</th>
                    <th style={styles.th}>Overall</th>
                  </tr>
                </thead>
                <tbody>
                  {fac.rows.map((row, j) => (
                    <tr key={j}>
                      <td style={styles.td}>{row.subject}</td>
                      <td style={styles.td}>{row.branch}</td>
                      <td style={styles.td}>{row.campus}</td>
                      <td style={styles.td}>{row.year}</td>
                      <td style={styles.td}>{row.studentCount}</td>
                      <td style={styles.td}>{row.avgRating}</td>
                      <td style={{ ...styles.td, color: "green" }}>{row.positive}</td>
                      <td style={{ ...styles.td, color: "orange" }}>{row.neutral}</td>
                      <td style={{ ...styles.td, color: "red" }}>{row.negative}</td>
                      <td style={styles.td}>{row.overallSentiment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        @media (max-width: 768px) {
          .container {
            padding: 15px !important;
          }
        }
      `}</style>
    </div>
  );
};

/* ================= RESPONSIVE STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg,#eef2ff,#e0f2fe)",
  },

  container: {
    maxWidth: "1200px",
    margin: "auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  filters: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px", // ensures scroll instead of squeezing
  },

  th: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px",
  },

  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
  },

  facultyCard: {
    marginBottom: "25px",
    padding: "15px",
    borderRadius: "10px",
    background: "#f9fafb",
  },

  loading: { textAlign: "center" },
  error: { textAlign: "center", color: "red" },
};

export default ViewFeedback;