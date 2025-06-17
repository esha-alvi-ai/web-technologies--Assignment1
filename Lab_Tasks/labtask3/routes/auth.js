const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Render Signup Page
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Handle Signup
router.post("/signup", async (req, res) => {
  const { firstname, email, password } = req.body;
  const user = new User({ firstname, email, password });
  await user.save();
  req.flash("success", "Signup successful. Please login.");
  res.redirect("/login");
});

// Render Login Page
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Handle Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    req.flash("error", "Invalid credentials");
    return res.redirect("/login");
  }

  // Store session
  req.session.user = {
    _id: user._id,
    email: user.email,
    isAdmin: user.isAdmin || false,
  };

  if (user.isAdmin) {
    return res.redirect("/admin/product");
  } else {
    return res.redirect("/");
  }
});

// Dashboard (optional)
router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
