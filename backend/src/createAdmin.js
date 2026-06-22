import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import User from "./models/User.js";

const admin = {
  name: process.env.ADMIN_NAME || "Admin User",
  email: process.env.ADMIN_EMAIL || "admin@codealpha.com",
  password: process.env.ADMIN_PASSWORD || "admin123",
  role: "admin"
};

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ email: admin.email }).select("+password");
  if (existing) {
    existing.name = admin.name;
    existing.password = admin.password;
    existing.role = "admin";
    await existing.save();
    console.log(`Admin updated: ${admin.email}`);
  } else {
    await User.create(admin);
    console.log(`Admin created: ${admin.email}`);
  }

  process.exit();
};

run();
