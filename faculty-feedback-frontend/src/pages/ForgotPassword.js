import { useState } from "react";
import API from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const sendLink = async () => {
    const res = await API.post("/api/auth/forgot-password", { email });
    setMsg(res.data.message);
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input onChange={(e) => setEmail(e.target.value)} />
      <button onClick={sendLink}>Send Link</button>
      <p>{msg}</p>
    </div>
  );
}
