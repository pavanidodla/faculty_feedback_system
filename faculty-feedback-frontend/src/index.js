import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="339143976116-8l4blrrpntbh096166r0s2t1jtifcf7f.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
