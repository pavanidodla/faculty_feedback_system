import express from "express";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

/* ===================================================
   SEND FEEDBACK LINK TO ALL STUDENTS
=================================================== */

router.post("/send-feedback-link", async (req, res) => {
  try {
    // Get only student users
    const students = await User.find({ role: "student" });

    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to each student
    for (const student of students) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.email,
        subject: "Submit Faculty Feedback",
        html: `
          <h3>Hello students,</h3>
          <p>Please submit your faculty feedback using the link below:</p>

          <a href="https://faculty-feedback-system-gshg.onrender.com/"
             style="background:#2563eb;color:white;padding:10px 20px;
                    text-decoration:none;border-radius:5px;">
             Submit Feedback
          </a>

          <p>Thank you.</p>
        `,
      });
    }

    res.json({ message: "Feedback link emails sent successfully" });

  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ message: "Failed to send emails" });
  }
});

export default router;
