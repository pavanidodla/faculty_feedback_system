import express from "express";
import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminMiddleware.js";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";

const router = express.Router();

/* ================= GET ADMIN DASHBOARD STATS ================= */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalFeedback = await Feedback.countDocuments();

    res.json({
      success: true,
      data: {
        totalStudents,
        totalAdmins,
        totalFeedback,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin statistics",
    });
  }
});

/* ================= VIEW ALL FEEDBACK ================= */
router.get("/feedbacks", protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("student", "name email studentId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    console.error("Feedback Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching feedbacks",
    });
  }
});

/* ================= DELETE FEEDBACK ================= */
router.delete("/feedback/:id", protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    await feedback.deleteOne();

    res.json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting feedback",
    });
  }
});

export default router;