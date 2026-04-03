import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();

  const [name, setName] = useState("Student");
  const [studentId, setStudentId] = useState("N/A");
  const [email, setEmail] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // ✅ Get user data
    setName(localStorage.getItem("name") || "Student");
    setStudentId(localStorage.getItem("studentId") || "N/A");
    setEmail(localStorage.getItem("email") || "");

    // 📱 Responsive handler
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 🔐 Logout */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  /* 🌅 Greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" :
    hour < 18 ? "Good Afternoon" :
    "Good Evening";

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        
        {/* 🔴 Top Bar */}
        <div style={styles.topBar}>
          <span style={styles.email}>{email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* 🌟 Hero Section */}
        <div style={styles.hero(isMobile)}>
          <div style={styles.heroCard(isMobile)}>
            <h1 style={styles.welcome(isMobile)}>
              {greeting}, {name} 👋
            </h1>
            <p style={styles.info}>Student ID: {studentId}</p>
            <p style={styles.subtitle(isMobile)}>
              Your feedback helps improve teaching quality and academic excellence.
            </p>
          </div>
        </div>

        {/* 🎯 Action Cards */}
        <div style={styles.container(isMobile)}>
          <div style={styles.cards(isMobile)}>

            {/* 📝 Give Feedback */}
            <div
              style={styles.card(isMobile)}
              onClick={() => navigate("/feedback")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div style={styles.icon}>📝</div>
              <h3 style={styles.cardTitle}>Give Feedback</h3>
              <p style={styles.cardText}>
                Submit detailed feedback about faculty performance.
              </p>
            </div>

            {/* 📊 View Feedback */}
            <div
              style={styles.card(isMobile)}
              onClick={() => navigate("/view-feedback")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
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

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
  },

  content: { flex: 1 },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
  },

  email: {
    fontSize: "14px",
    color: "#555",
  },

  logoutBtn: {
    padding: "8px 16px",
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  hero: (mobile) => ({
    padding: mobile ? "30px 15px" : "60px 20px",
    display: "flex",
    justifyContent: "center",
  }),

  heroCard: (mobile) => ({
    width: "90%",
    maxWidth: "800px",
    padding: mobile ? "25px" : "40px",
    borderRadius: "25px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    textAlign: "center",
    boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
  }),

  welcome: (mobile) => ({
    fontSize: mobile ? "24px" : "32px",
    marginBottom: "10px",
  }),

  info: {
    fontSize: "14px",
    opacity: 0.9,
    marginBottom: "10px",
  },

  subtitle: (mobile) => ({
    fontSize: mobile ? "14px" : "16px",
    opacity: 0.95,
  }),

  container: (mobile) => ({
    padding: mobile ? "20px 10px" : "40px 20px",
    display: "flex",
    justifyContent: "center",
  }),

  cards: (mobile) => ({
    display: "flex",
    gap: "30px",
    flexDirection: mobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
  }),

  card: (mobile) => ({
    width: mobile ? "90%" : "320px",
    padding: mobile ? "25px" : "35px",
    borderRadius: "20px",
    background: "#ffffff",
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
    textAlign: "center",
  }),

  icon: {
    fontSize: "45px",
    marginBottom: "15px",
  },

  cardTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },

  cardText: {
    fontSize: "14px",
    color: "#4a5568",
  },
};
