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
