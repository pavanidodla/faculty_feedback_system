import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../api";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const reset = async () => {
    await API.post(`/api/auth/reset-password/${token}`, { password });
    alert("Password reset successful");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input onChange={(e) => setPassword(e.target.value)} />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
