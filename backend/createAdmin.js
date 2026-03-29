import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {

  const adminEmail = "pavani826@gmail.com";

  const adminExists = await User.findOne({ email: adminEmail });

  if (adminExists) {
    console.log("Admin already exists ❗");
    process.exit();
  }

  await User.create({
    name: "Admin",
    email: adminEmail,
    password: "pavani123",
    role: "admin"
  });

  console.log("Admin created successfully ✅");
  process.exit();
};

createAdmin();