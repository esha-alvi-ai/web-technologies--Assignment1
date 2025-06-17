// scripts/createAdmin.js

const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.connect("mongodb://localhost:27017/bai", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
    } else {
      await User.create({
        email: "admin@example.com",
        password: "admin123456789", // use bcrypt if needed
        isAdmin: true,
      });
      console.log("✅ Admin created!");
    }
  } catch (error) {
    console.error("❌ Failed to create admin:", error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
