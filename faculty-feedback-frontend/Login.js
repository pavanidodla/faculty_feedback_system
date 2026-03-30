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

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        role: isAdminForm ? "admin" : "user",
      });

      const { token, role, name, email: userEmail, studentId } = res.data;

      /* 🚫 BLOCK ADMIN FROM USER LOGIN */
      if (!isAdminForm && role === "admin") {
        setError("Admins must login using Admin Login");
        setEmail("");
        setPassword("");
        return;
      }

      /* 🚫 BLOCK USER FROM ADMIN LOGIN */
      if (isAdminForm && role !== "admin") {
        setError("Only admins can login here");
        setEmail("");
        setPassword("");
        return;
      }

      /* SAVE SESSION */
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("studentId", studentId);

      /* CLEAR FIELDS */
      setEmail("");
      setPassword("");
      setError("");

      navigate(role === "admin" ? "/admin-dashboard" : "/dashboard");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      setEmail("");
      setPassword("");
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });

      const { token, role, name, email: userEmail, studentId } = res.data;

      if (!isAdminForm && role === "admin") {
        setError("Admins must login using Admin Login");
        return;
      }

      if (isAdminForm && role !== "admin") {
        setError("Only admins can login here");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("studentId", studentId);

      setEmail("");
      setPassword("");
      setError("");

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
          <img src="college.jpg" alt="Login" style={styles.image} />
        </div>

        {/* RIGHT FORM */}
        <div style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.title}>
              {isAdminForm ? "Admin Login" : "User Login"}
            </h2>

            {error && <p style={styles.error}>{error}</p>}

            <input
              type="email"
              placeholder={isAdminForm ? "Admin Email" : "College Email"}
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

            <button onClick={handleLogin} style={styles.loginBtn}>
              Login
            </button>

            <div style={{ marginTop: 15 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Sign-in failed")}
              />
            </div>

            <p style={styles.switchText}>
              {isAdminForm ? "Back to " : "Are you an admin? "}
              <span
                onClick={() => {
                  setIsAdminForm(!isAdminForm);
                  setEmail("");
                  setPassword("");
                  setError("");
                }}
                style={styles.switchLink}
              >
                {isAdminForm ? "User Login" : "Admin Login"}
              </span>
            </p>

            {!isAdminForm && (
              <p style={styles.registerText}>
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  style={styles.registerLink}
                >
                  Register here
                </span>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "10px",
  },

  container: {
    display: "flex",
    flexDirection: "row",      // 👈 always side-by-side
    width: "100%",
    maxWidth: "850px",
    minHeight: "400px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
  },

  /* image section */
  left: {
    flex: 1,
    minWidth: "40%",           // keeps image visible on mobile
    background: "#e0e0e0",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  /* form section */
  right: {
    flex: 1,
    minWidth: "60%",           // ensures form has enough space
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#fff",
    padding: "15px",
  },

  card: {
    width: "100%",
    maxWidth: "300px",
    textAlign: "center",
  },

  title: {
    marginBottom: "12px",
    fontSize: "20px",
    fontWeight: "bold",
  },

  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "5px",
  },

  input: {
    width: "100%",
    padding: "8px",
    margin: "6px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  loginBtn: {
    width: "100%",
    padding: "8px",
    marginTop: "8px",
    background: "#1e88e5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },

  switchText: {
    marginTop: "10px",
    fontSize: "12px",
  },

  switchLink: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },

  registerText: {
    marginTop: "6px",
    fontSize: "12px",
  },

  registerLink: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },
};