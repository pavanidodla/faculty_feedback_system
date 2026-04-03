import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();

  const [isAdminForm, setIsAdminForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");

      if (
        !email.endsWith("@rguktrkv.ac.in") &&
        !email.endsWith("@rguktong.ac.in")
      ) {
        return setError("Use college email only");
      }

      const res = await API.post("/api/auth/login", {
        email,
        password,
        expectedRole: isAdminForm ? "admin" : "student",
      });

      const { token, role, name } = res.data;

      // 🔴 Strict role check
      if (isAdminForm && role !== "admin") {
        return setError("Not an admin");
      }
      if (!isAdminForm && role !== "student") {
        return setError("Not a student");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (resGoogle) => {
    try {
      const res = await API.post("/api/auth/google", {
        token: resGoogle.credential,
      });

      const { token, role } = res.data;

      if (isAdminForm && role !== "admin") {
        return setError("Not an admin");
      }
      if (!isAdminForm && role !== "student") {
        return setError("Not a student");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");

    } catch {
      setError("Google login failed");
    }
  };

 return (
  <div style={styles.wrapper}>
    <div style={styles.container}>
      
      {/* LEFT IMAGE */}
      <div style={styles.left}>
        <img src="/college.jpg" alt="login" style={styles.image} />
      </div>

      {/* RIGHT FORM */}
      <div style={styles.right}>
        <div style={styles.card}>

          <h2 style={styles.title}>
            {isAdminForm ? "Admin Login" : "Student Login"}
          </h2>

          {error && <p style={styles.error}>{error}</p>}

          <input
            type="email"
            placeholder="College Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={handleLogin}
            style={styles.loginBtn}
            onMouseEnter={(e) =>
              (e.target.style.background = "#1565c0")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "#1e88e5")
            }
          >
            Login
          </button>

          <p
            onClick={() => navigate("/forgot-password")}
            style={styles.link}
          >
            Forgot Password?
          </p>

          <div style={{ margin: "15px 0" }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} />
          </div>

          <p style={styles.switchText}>
            {isAdminForm ? "Back to " : "Are you admin? "}
            <span
              onClick={() => setIsAdminForm(!isAdminForm)}
              style={styles.switchLink}
            >
              {isAdminForm ? "Student Login" : "Admin Login"}
            </span>
          </p>

          {!isAdminForm && (
            <p
              onClick={() => navigate("/register")}
              style={styles.registerLink}
            >
              Register
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px",
  },

  container: {
    display: "flex",
    width: "750px",
    height: "480px",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    background: "#fff",
  },

  left: {
    flex: 1,
    background: "#ddd",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "100%",
    textAlign: "center",
  },

  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },

  input: {
    width: "90%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "0.3s",
  },

  loginBtn: {
    width: "95%",
    padding: "12px",
    marginTop: "10px",
    background: "#1e88e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },

  link: {
    marginTop: "10px",
    color: "#1e88e5",
    cursor: "pointer",
    fontSize: "14px",
  },

  switchText: {
    marginTop: "12px",
    fontSize: "14px",
  },

  switchLink: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },

  registerLink: {
    marginTop: "8px",
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};
