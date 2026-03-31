import express from "express";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

/* ===================================================
   SEND FEEDBACK LINK TO ALL STUDENTS
=================================================== */

router.post("/send-feedback-link", async (req, res) => {
  try {
    console.log("📧 Fetching students...");

    const students = await User.find({ role: "student" });

    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    console.log("👨‍🎓 Students found:", students.length);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare all email promises
    const emailPromises = students.map((student) => {
      if (!student.email) return null;

      return transporter.sendMail({
        from: `RGUKT Feedback <${process.env.EMAIL_USER}>`,
        to: student.email,
        subject: "Submit Faculty Feedback",
        html: `
          <h3>Hello ${student.name || "Student"},</h3>
          <p>Please submit your faculty feedback using the link below:</p>

          <a href="https://faculty-feedback-system-gshg.onrender.com/"
             style="background:#2563eb;color:white;padding:10px 20px;
                    text-decoration:none;border-radius:5px;">
             Submit Feedback
          </a>

          <p>Thank you.</p>
        `,
      });
    });

    // Send emails in parallel
    await Promise.all(emailPromises);

    console.log("✅ All emails sent successfully");

    res.json({
      message: `Feedback links sent to ${students.length} students`,
    });

  } catch (err) {
    console.error("❌ Email sending failed:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
