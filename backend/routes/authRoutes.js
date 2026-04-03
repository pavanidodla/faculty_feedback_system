import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase().trim();
    name = name.trim();
    password = password.trim();

    if (
      !email.endsWith("@rguktrkv.ac.in") &&
      !email.endsWith("@rguktong.ac.in")
    ) {
      return res.status(403).json({ message: "Use a valid RGUKT email" });
    }

    const exist = await User.findOne({ email });
    if (exist)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const studentId = email.split("@")[0]?.toUpperCase() || "N/A";

    await User.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      role: "student",
    });

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password, expectedRole } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    email = email.toLowerCase().trim();
    password = password.trim();

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    // 🔴 STRICT ROLE CHECK
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        message: `Access denied: ${expectedRole} login only`,
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      userId: user._id,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GOOGLE LOGIN ================= */
router.post("/google", async (req, res) => {
  try {
    const { token, expectedRole } = req.body;

    // ✅ Check token
    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    // ✅ Verify Google token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      console.error("VERIFY ERROR:", err.message);
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || "User";
    const googleId = payload.sub;

    // ✅ Allow only college emails
    if (
      !email.endsWith("@rguktrkv.ac.in") &&
      !email.endsWith("@rguktong.ac.in")
    ) {
      return res.status(403).json({
        message: "Use RGUKT Google account only",
      });
    }

    // ✅ Admin detection
    const adminEmails = [
      "hod@rguktrkv.ac.in",
      "dean@rguktrkv.ac.in",
      "admin@rguktrkv.ac.in",
      "hod@rguktong.ac.in",
      "dean@rguktong.ac.in",
      "admin@rguktong.ac.in",
    ];

    const role = adminEmails.includes(email) ? "admin" : "student";

    // ✅ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // 🔥 CREATE NEW USER
      user = await User.create({
        name,
        email,
        googleId,
        studentId: email.split("@")[0].toUpperCase(),
        role,
      });
    } else {
      // 🔥 UPDATE EXISTING USER (SAFE FIX)
      user.googleId = googleId;
      user.role = role;

      // ❗ Prevent validation issues
      await user.save({ validateBeforeSave: false });
    }

    // 🔴 STRICT ROLE CHECK
    if (expectedRole && role !== expectedRole) {
      return res.status(403).json({
        message: `Access denied: ${expectedRole} only`,
      });
    }

    // ✅ Generate JWT
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send response
    res.json({
      token: jwtToken,
      role: user.role,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
    });

  } catch (err) {
    console.error("GOOGLE LOGIN ERROR FULL:", err);
    res.status(500).json({ message: "Google login failed" });
  }
});
/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const link = `http://localhost:3000/reset-password/${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<h3>Password Reset</h3>
             <p>Click below link to reset password:</p>
             <a href="${link}">${link}</a>`,
    });

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Error sending email" });
  }
});

/* ================= RESET PASSWORD ================= */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
