import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import academicRoutes from "./routes/academicRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

dotenv.config();

const app = express();

/* ================= Middleware ================= */
app.use(cors());
app.use(express.json());

/* ================= Routes ================= */
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/admin", emailRoutes);

/* ================= MongoDB ================= */
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Database connection failed ", err);
    process.exit(1);
  }
};

startServer();
