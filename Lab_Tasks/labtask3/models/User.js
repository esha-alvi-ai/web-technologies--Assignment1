const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
  // You can add more fields later when needed
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
