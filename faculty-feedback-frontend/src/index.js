import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="241853693814-7n33c9gu9r9juc36hrr7no2ijs6psoen.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);