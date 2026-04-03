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
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{isAdminForm ? "Admin Login" : "Student Login"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="email"
        placeholder="College Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>

      <p onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer", color: "blue" }}>
        Forgot Password?
      </p>

      <GoogleLogin onSuccess={handleGoogleSuccess} />

      <p>
        {isAdminForm ? "Back to " : "Are you admin? "}
        <span onClick={() => setIsAdminForm(!isAdminForm)} style={{ color: "blue", cursor: "pointer" }}>
          {isAdminForm ? "Student Login" : "Admin Login"}
        </span>
      </p>

      {!isAdminForm && (
        <p onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "blue" }}>
          Register
        </p>
      )}
    </div>
  );
}
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
