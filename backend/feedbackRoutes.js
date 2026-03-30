import express from "express";
import Feedback from "../models/Feedback.js";
import axios from "axios";
import ExcelJS from "exceljs";

const router = express.Router();


/* =========================================================
   SAVE FEEDBACK WITH AI SENTIMENT
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { studentId, year, semester, branch, campus, feedbacks } = req.body;

    if (!studentId || !year || !semester || !campus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    /* Analyze comments using Python AI */
    const updatedFeedbacks = await Promise.all(
      feedbacks.map(async (fb) => {

        const combinedComment = fb.comments.join(" ").trim();

        // If no comment, skip AI call
        if (!combinedComment) {
          return {
            ...fb,
            sentiment: "neutral",
            sentimentScore: 0
          };
        }

        try {
          const aiResponse = await axios.post(
            "https://faculty-feedback-ml.onrender.com/analyze",
            { comment: combinedComment }
          );

          return {
            ...fb,
            sentiment: aiResponse.data.sentiment,
            sentimentScore: aiResponse.data.score
          };

        } catch (aiErr) {
          console.log("AI service error:", aiErr.message);

          return {
            ...fb,
            sentiment: "unknown",
            sentimentScore: 0
          };
        }
      })
    );

    const newFeedback = new Feedback({
      studentId,
      year,
      semester,
      branch,
      campus,              // ⭐ store campus
      feedbacks: updatedFeedbacks
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback saved with AI analysis"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});


/* =========================================================
   GET ALL FEEDBACK
========================================================= */
router.get("/", async (req, res) => {
  try {
    const data = await Feedback.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* =========================================================
   EXPORT FEEDBACK TO EXCEL
========================================================= */
router.get("/export", async (req, res) => {
  try {
    const { year, branch, campus } = req.query;

    let filter = {};
    if (year) filter.year = year;
    if (branch && branch !== "all") filter.branch = branch;
    if (campus && campus !== "all") filter.campus = campus;

    const feedbacks = await Feedback.find(filter);

    /* Create workbook */
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Feedback Report");

    sheet.columns = [
      { header: "Student ID", key: "studentId", width: 20 },
      { header: "Campus", key: "campus", width: 15 },
      { header: "Year", key: "year", width: 10 },
      { header: "Branch", key: "branch", width: 15 },
      { header: "Subject", key: "subject", width: 40 },
      { header: "Faculty", key: "faculty", width: 30 },
      { header: "Avg Rating", key: "rating", width: 15 },
      { header: "Sentiment", key: "sentiment", width: 15 },
      { header: "Sentiment Score", key: "score", width: 20 }
    ];

    sheet.getRow(1).font = { bold: true };

    /* Group by student */
    const studentMap = {};

    feedbacks.forEach(record => {

      if (!studentMap[record.studentId]) {
        studentMap[record.studentId] = {
          studentId: record.studentId,
          campus: record.campus,
          year: record.year,
          branch: record.branch,
          feedbacks: []
        };
      }

      record.feedbacks.forEach(fb => {

        const avgRating =
          fb.ratings.reduce((a, b) => a + b, 0) / fb.ratings.length;

        studentMap[record.studentId].feedbacks.push({
          subject: fb.subject,
          faculty: fb.faculty,
          rating: avgRating.toFixed(1),
          sentiment: fb.sentiment,
          score: fb.sentimentScore
        });

      });

    });

    /* Write rows */
    Object.values(studentMap).forEach(student => {

      student.feedbacks.forEach((fb, index) => {

        const row = sheet.addRow({
          studentId: index === 0 ? student.studentId : "",
          campus: index === 0 ? student.campus : "",
          year: index === 0 ? student.year : "",
          branch: index === 0 ? student.branch : "",
          subject: fb.subject,
          faculty: fb.faculty,
          rating: fb.rating,
          sentiment: fb.sentiment,
          score: fb.score
        });

        row.alignment = {
          vertical: "middle",
          horizontal: "center"
        };

      });

    });

    /* Response headers */
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=feedback-report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Excel Export Failed" });
  }
});

export default router;