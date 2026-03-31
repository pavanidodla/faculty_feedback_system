import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
  try {
    setError("");
    setSuccess("");

    // Allow only college emails
    if (
      !email.endsWith("@rguktrkv.ac.in") &&
      !email.endsWith("@rguktong.ac.in")
    ) {
      return setError(
        "Use your college email (@rguktrkv.ac.in or @rguktong.ac.in)"
      );
    }

    const res = await API.post("/api/auth/register", {
      name,
      email,
      password,
    });

    setSuccess("Registration successful. You can now login.");
    setTimeout(() => navigate("/"), 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* LEFT IMAGE */}
        <div style={styles.left}>
          <img
            src="/college.jpg"
            alt="College"
            style={styles.image}
          />
        </div>

        {/* RIGHT FORM */}
        <div style={styles.right}>
          <div style={styles.card}>
            <h2 style={styles.title}>Student Registration</h2>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

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

            <button style={styles.registerBtn} onClick={handleRegister}>
              Register
            </button>

            <p style={styles.loginText}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                style={styles.loginLink}
              >
                Login here
              </span>
            </p>
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
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
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
    position: "relative",
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
    padding: "10px",
  },
  title: { marginBottom: "15px", fontSize: "22px", fontWeight: "bold" },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  registerBtn: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loginText: {
    marginTop: "12px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#1e88e5",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  success: {
    color: "green",
    fontSize: "14px",
  },
};

