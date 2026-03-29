import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  branch: {
    type: String
  },

  // ⭐ NEW FIELD: CAMPUS / COLLEGE
  campus: {
    type: String,
    required: true,
    enum: ["RK Valley", "Ongole"]   // restrict values
  },

  feedbacks: [
    {
      subject: String,
      faculty: String,
      ratings: [Number],
      comments: [String],

      // ⭐ AI fields
      sentiment: {
        type: String
      },
      sentimentScore: {
        type: Number
      }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);