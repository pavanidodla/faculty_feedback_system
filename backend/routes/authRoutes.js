import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    // Allow both RKV and Ongole domains
    if (!email.endsWith("@rguktrkv.ac.in") && !email.endsWith("@rguktong.ac.in")) {
      return res.status(403).json({
        message: "Students must use RGUKT email"
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const studentId = email.split("@")[0].toUpperCase();

    await User.create({
      name,
      email,
      password,
      studentId,
      role: "student"
    });

    res.status(201).json({
      message: "Registration successful"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    res.status(500).json({
      message: "Server error"
    });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.password)
      return res.status(400).json({
        message: "Use Google login for this account"
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      studentId: user.studentId,
      userId: user._id
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GOOGLE LOGIN ================= */
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const name = payload.name;
    const googleId = payload.sub;

    // Allow both RKV and Ongole domains
    if (!email.endsWith("@rguktrkv.ac.in") && !email.endsWith("@rguktong.ac.in")) {
      return res.status(403).json({
        message: "Use college Google account"
      });
    }

    const adminEmails = [
      "hod@rguktrkv.ac.in",
      "dean@rguktrkv.ac.in",
      "admin@rguktrkv.ac.in",
      "hod@rguktong.ac.in",
      "dean@rguktong.ac.in",
      "admin@rguktong.ac.in"
    ];

    const role = adminEmails.includes(email) ? "admin" : "student";

    let user = await User.findOne({ email });

    if (!user) {
      const studentId = email.split("@")[0].toUpperCase();

      user = await User.create({
        name,
        email,
        googleId,
        studentId,
        role
      });
    } else {
      user.googleId = googleId;
      user.role = role;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token: jwtToken,
      role: user.role,
      name: user.name,
      studentId: user.studentId,
      userId: user._id
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});

export default router;
