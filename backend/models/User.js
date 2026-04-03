import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        // ❗ Password required only if NOT Google user
        return !this.googleId;
      },
    },

    studentId: {
      type: String,
      default: "N/A",
    },

    googleId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    /* 🔁 FORGOT PASSWORD */
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

/* ================= PASSWORD HASHING ================= */
userSchema.pre("save", async function (next) {
  // 🔐 Avoid re-hashing already hashed password
  if (!this.isModified("password")) return next();

  // ❗ Skip hashing if password is not present (Google login)
  if (!this.password) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ================= PASSWORD COMPARE ================= */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
