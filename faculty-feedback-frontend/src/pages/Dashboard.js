import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("Student");
  const [studentId, setStudentId] = useState("N/A");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/"); // redirect if not logged in

    const storedName = localStorage.getItem("name") || "Student";
    const storedStudentId = localStorage.getItem("studentId") || "N/A"; // <-- get from localStorage

    setName(storedName);
    setStudentId(storedStudentId);
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroCard}>
            <h1 style={styles.welcome}>Welcome back, {name} 👋</h1>
            <p style={styles.info}>Student ID: {studentId}</p>
            <p style={styles.subtitle}>
              Your feedback helps improve teaching quality and academic excellence.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div style={styles.container}>
          <div style={styles.cards}>
            <div style={styles.card} onClick={() => navigate("/feedback")}>
              <div style={styles.icon}>📝</div>
              <h3 style={styles.cardTitle}>Give Feedback</h3>
              <p style={styles.cardText}>
                Submit detailed feedback about faculty performance.
              </p>
            </div>

            <div style={styles.card} onClick={() => navigate("/view-feedback")}>
              <div style={styles.icon}>📊</div>
              <h3 style={styles.cardTitle}>View Feedback</h3>
              <p style={styles.cardText}>
                Review your submitted feedback and ratings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)" },
  content: { flex: 1 },
  hero: { padding: "60px 20px", display: "flex", justifyContent: "center" },
  heroCard: { width: "90%", maxWidth: "800px", padding: "40px", borderRadius: "25px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" },
  welcome: { fontSize: "32px", marginBottom: "10px" },
  info: { fontSize: "14px", opacity: 0.9, marginBottom: "15px" },
  subtitle: { fontSize: "16px", opacity: 0.95 },
  container: { padding: "40px 20px", display: "flex", justifyContent: "center" },
  cards: { display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" },
  card: { width: "320px", padding: "35px", borderRadius: "20px", background: "#ffffff", cursor: "pointer", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", transition: "all 0.3s ease", textAlign: "center" },
  icon: { fontSize: "45px", marginBottom: "15px" },
  cardTitle: { fontSize: "20px", marginBottom: "10px" },
  cardText: { fontSize: "14px", color: "#4a5568" },
};