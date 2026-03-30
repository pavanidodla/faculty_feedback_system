import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [isAdminForm, setIsAdminForm] = useState(false); // toggle between user/admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* ================= NORMAL / ADMIN LOGIN ================= */
  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        role: isAdminForm ? "admin" : "user",
      });
      const { token, role, name, email: userEmail,studentId } = res.data;

      // store in localStorage for dashboard
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("studentId",studentId);

      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials or role");
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });
      const { token, role, name, email: userEmail,studentId } = res.data;

      // store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);
      localStorage.setItem("studentId",studentId);

      if (role === "admin") navigate("/admin-dashboard");
      else navigate("/dashboard");
    } catch {
      alert("Google login failed");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* LEFT IMAGE */}
        <div style={styles.left}>
          <img
            src="college.jpg"
            alt="Login"
            style={styles.image}
          />
        </div>

        {/* RIGHT LOGIN */}
        <div style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.title}>
              {isAdminForm ? "Admin Login" : "User Login"}
            </h2>

            {/* EMAIL */}
            <input
              type="email"
              placeholder="College Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            {/* LOGIN BUTTON */}
            <button onClick={handleLogin} style={styles.loginBtn}>
              Login
            </button>

            {/* GOOGLE LOGIN */}
            <div style={{ marginTop: 15 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Sign-in failed")}
              />
            </div>

            {/* SWITCH FORMS */}
            <p style={styles.switchText}>
              {isAdminForm ? "Back to " : "Are you an admin? "}
              <span
                onClick={() => {
                  setIsAdminForm(!isAdminForm);
                  setEmail("");
                  setPassword("");
                }}
                style={styles.switchLink}
              >
                {isAdminForm ? "User Login" : "Admin Login"}
              </span>
            </p>

            {/* REGISTER LINK (only for user login) */}
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
    height: "100vh",
    background: "#f4f6f8",
    padding: "20px",
  },
  container: {
    display: "flex",
    width: "700px",
    height: "450px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    borderRadius: "12px",
    overflow: "hidden",
  },
  left: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#e0e0e0",
    padding: "15px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  },
  right: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
    padding: "20px",
  },
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    padding: "20px",
  },
  title: { marginBottom: "15px", fontSize: "22px", fontWeight: "bold" },
  input: {
    width: "93%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  loginBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#1e88e5",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
  registerText: {
    marginTop: "8px",
    fontSize: "14px",
  },
  registerLink: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
