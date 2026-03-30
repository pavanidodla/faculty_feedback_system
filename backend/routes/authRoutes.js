import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= EMAIL DOMAIN CHECK FUNCTION ================= */
function isValidRguktEmail(email) {
  const allowedDomains = [
    "@rguktrkv.ac.in",
    "@rguktong.ac.in"
  ];

  return allowedDomains.some(domain =>
    email.endsWith(domain)
  );
}

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    /* DOMAIN VALIDATION */
    if (!isValidRguktEmail(email)) {
      return res.status(403).json({
        message: "Use your RGUKT college email"
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const studentId = email.split("@")[0].toUpperCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      role: "student"
    });

    res.status(201).json({
      message: "Registration successful"
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
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
    const requestedRole = req.body.role; // student/admin

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    /* BLOCK PASSWORD LOGIN FOR GOOGLE USERS */
    if (!user.password)
      return res.status(400).json({
        message: "Use Google login for this account"
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    /* ROLE VALIDATION */
    if (user.role !== requestedRole) {
      return res.status(403).json({
        message:
          user.role === "admin"
            ? "Admins must login using Admin Login"
            : "Students must login using Student Login"
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
    const { token, role: requestedRole } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase();
    const name = payload.name;
    const googleId = payload.sub;

    /* DOMAIN VALIDATION */
    if (!isValidRguktEmail(email)) {
      return res.status(403).json({
        message: "Use your RGUKT Google account"
      });
    }

    /* ADMIN EMAIL LIST */
    const adminEmails = [
      "hod@rguktrkv.ac.in",
      "dean@rguktrkv.ac.in",
      "admin@rguktrkv.ac.in"
    ];

    const actualRole = adminEmails.includes(email)
      ? "admin"
      : "student";

    /* BLOCK WRONG PORTAL LOGIN */
    if (actualRole !== requestedRole) {
      return res.status(403).json({
        message:
          actualRole === "admin"
            ? "Admins must login using Admin Login"
            : "Students must login using Student Login"
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const studentId = email.split("@")[0].toUpperCase();

      user = await User.create({
        name,
        email,
        googleId,
        studentId,
        role: actualRole
      });
    } else {
      user.googleId = googleId;
      user.role = actualRole;
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
    res.status(500).json({
      message: "Google login failed"
    });
  }
});
export default router;
