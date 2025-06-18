const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.get("/signup", (req, res) => {
  res.render("auth/signup");
});


router.post("/signup", async (req, res) => {
  const { firstname, email, password } = req.body;
  const user = new User({ firstname, email, password });
  await user.save();
  req.flash("success", "Signup successful. Please login.");
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  console.log("Login attempt with:", email); // ✅ Add this

  const user = await User.findOne({ email });
  console.log("User found:", user); // ✅ Add this

  if (!user) {
    req.flash("error", "Invalid email");
    return res.redirect("/login");
  }

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




router.get("/dashboard", (req, res) => {
  res.render("dashboard", { user: req.session.user });
});


router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
