import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function ViewFeedback() {

  const [feedbacks, setFeedbacks] = useState([]);

  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("studentId");

  const loadFeedbacks = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/feedback"
      );

      let data = res.data || [];

      if (role === "student" && studentId) {
  data = data.filter(f =>
    f.studentId?.toLowerCase().trim() ===
    studentId.toLowerCase().trim()
  );
}

      setFeedbacks(data);

    } catch (err) {
      console.log(err);
    }
  }, [role, studentId]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <h2 style={styles.heading}>📊 View Feedback</h2>

        {feedbacks.length === 0 && (
          <p style={styles.noData}>No Feedback Found</p>
        )}

        {feedbacks.length > 0 && (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Student ID</th>
                  <th style={styles.th}>Campus</th>
                  <th style={styles.th}>Year</th>
                  <th style={styles.th}>Semester</th>
                  <th style={styles.th}>Subject</th>
                  <th style={styles.th}>Faculty</th>
                  <th style={styles.th}>Ratings</th>
                  <th style={styles.th}>Comments</th>
                </tr>
              </thead>

              <tbody>
  {feedbacks.map((f, i) =>
    (f.feedbacks || []).map((fb, j) => (
      <tr key={i + "-" + j} style={styles.tr}>
        
        {j === 0 && (
          <>
            <td style={styles.td} rowSpan={f.feedbacks.length}>
              {f.studentId}
            </td>
            <td style={styles.td} rowSpan={f.feedbacks.length}>
              {f.campus || "N/A"}
            </td>
            <td style={styles.td} rowSpan={f.feedbacks.length}>
              {f.year}
            </td>
            <td style={styles.td} rowSpan={f.feedbacks.length}>
              {f.semester}
            </td>
          </>
        )}

        <td style={styles.td}>{fb.subject}</td>
        <td style={styles.td}>{fb.faculty}</td>
        <td style={styles.td}>
          {Array.isArray(fb.ratings)
            ? fb.ratings.join(", ")
            : fb.ratings}
        </td>
        <td style={styles.td}>
          {Array.isArray(fb.comments)
            ? fb.comments.join(", ")
            : fb.comments}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    padding: "50px 20px",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)"
  },

  container: {
    maxWidth: "1200px",
    margin: "auto",
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.1)"
  },

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#4f46e5",
    fontSize: "28px",
    fontWeight: "600"
  },

  noData: {
    textAlign: "center",
    fontSize: "16px",
    color: "#6b7280"
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    padding: "14px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151"
  },

  tr: {
    transition: "background 0.3s ease"
  }

};