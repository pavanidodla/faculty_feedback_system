import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    let facultyMap = {};

    const questions = [
      "Concept Explanation",
      "Subject Knowledge",
      "Interaction",
      "Doubt Clearing",
      "Punctuality"
    ];

    feedbacks.forEach(record => {

      const { campus, branch, year } = record;

      if (!record.feedbacks) return;

      record.feedbacks.forEach(fb => {

        if (!fb.faculty || !fb.ratings) return;

        /* Create Faculty Node */
        if (!facultyMap[fb.faculty]) {
          facultyMap[fb.faculty] = {
            faculty: fb.faculty,
            campuses: {}
          };
        }

        /* Create Campus */
        if (!facultyMap[fb.faculty].campuses[campus]) {
          facultyMap[fb.faculty].campuses[campus] = {};
        }

        /* Create Branch */
        if (!facultyMap[fb.faculty].campuses[campus][branch]) {
          facultyMap[fb.faculty].campuses[campus][branch] = {};
        }

        /* Create Year Node */
        if (!facultyMap[fb.faculty].campuses[campus][branch][year]) {
          facultyMap[fb.faculty].campuses[campus][branch][year] = {
            total: 0,
            count: 0,
            questionScores: Array(5).fill(0)
          };
        }

        const node =
          facultyMap[fb.faculty]
            .campuses[campus][branch][year];

        /* Student average */
        const avg =
          fb.ratings.reduce((a, b) => a + b, 0) /
          fb.ratings.length;

        node.total += avg;
        node.count++;

        fb.ratings.forEach((r, i) => {
          node.questionScores[i] += Number(r);
        });

      });

    });

    /* ===============================
       Final Processing
    =============================== */

    const result = Object.values(facultyMap).map(fac => {

      Object.entries(fac.campuses).forEach(([campus, branches]) => {

        Object.entries(branches).forEach(([branch, years]) => {

          Object.entries(years).forEach(([year, data]) => {

            const avgRating = data.total / data.count;

            const avgScores = data.questionScores.map(
              s => s / data.count
            );

            let weakAreas = [];

            avgScores.forEach((score, i) => {
              if (score < 4.5) {
                weakAreas.push(`Improve ${questions[i]}`);
              }
            });

            fac.campuses[campus][branch][year] = {
              rating: Number(avgRating.toFixed(2)),
              responses: data.count,
              weakArea:
                weakAreas.length > 0
                  ? weakAreas.join(" | ")
                  : "No Weak Areas"
            };

          });

        });

      });

      return fac;
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Leaderboard Processing Error"
    });
  }
});

export default router;