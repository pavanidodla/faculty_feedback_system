import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  studentId: String,

  googleId: {
    type: String,
    default: null
  },

  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  }
});

/* ================= Password Hashing ================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);