import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh"}}>
        <Outlet />
      </div>
    </>
  );
}