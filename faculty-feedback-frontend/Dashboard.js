import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("Student");
  const [studentId, setStudentId] = useState("N/A");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    const storedName = localStorage.getItem("name") || "Student";
    const storedStudentId = localStorage.getItem("studentId") || "N/A";

    setName(storedName);
    setStudentId(storedStudentId);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero(isMobile)}>
          <div style={styles.heroCard(isMobile)}>
            <h1 style={styles.welcome(isMobile)}>
              Welcome back, {name} 👋
            </h1>
            <p style={styles.info}>Student ID: {studentId}</p>
            <p style={styles.subtitle(isMobile)}>
              Your feedback helps improve teaching quality and academic excellence.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div style={styles.container(isMobile)}>
          <div style={styles.cards(isMobile)}>
            <div
              style={styles.card(isMobile)}
              onClick={() => navigate("/feedback")}
            >
              <div style={styles.icon}>📝</div>
              <h3 style={styles.cardTitle}>Give Feedback</h3>
              <p style={styles.cardText}>
                Submit detailed feedback about faculty performance.
              </p>
            </div>

            <div
              style={styles.card(isMobile)}
              onClick={() => navigate("/view-feedback")}
            >
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
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)"
  },

  content: { flex: 1 },

  hero: (mobile) => ({
    padding: mobile ? "30px 15px" : "60px 20px",
    display: "flex",
    justifyContent: "center"
  }),

  heroCard: (mobile) => ({
    width: "90%",
    maxWidth: "800px",
    padding: mobile ? "25px" : "40px",
    borderRadius: "25px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.2)"
  }),

  welcome: (mobile) => ({
    fontSize: mobile ? "24px" : "32px",
    marginBottom: "10px"
  }),

  info: {
    fontSize: "14px",
    opacity: 0.9,
    marginBottom: "15px"
  },

  subtitle: (mobile) => ({
    fontSize: mobile ? "14px" : "16px",
    opacity: 0.95
  }),

  container: (mobile) => ({
    padding: mobile ? "20px 10px" : "40px 20px",
    display: "flex",
    justifyContent: "center"
  }),

  cards: (mobile) => ({
    display: "flex",
    gap: "30px",
    flexDirection: mobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "center"
  }),

  card: (mobile) => ({
    width: mobile ? "90%" : "320px",
    padding: mobile ? "25px" : "35px",
    borderRadius: "20px",
    background: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    textAlign: "center"
  }),

  icon: {
    fontSize: "45px",
    marginBottom: "15px"
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px"
  },

  cardText: {
    fontSize: "14px",
    color: "#4a5568"
  }
};