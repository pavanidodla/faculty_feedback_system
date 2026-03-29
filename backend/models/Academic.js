import mongoose from "mongoose";

const academicSchema = new mongoose.Schema({

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

  subject: {
    type: String,
    required: true
  },

  facultyList: {
    type: [String],
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Academic", academicSchema);