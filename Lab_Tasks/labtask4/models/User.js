const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
