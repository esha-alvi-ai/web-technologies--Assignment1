const User = require("../models/User");

// Render signup form
exports.renderSignup = (req, res) => {
  res.render("signup");
};

// Handle signup logic
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    req.flash("success", "Signup successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", "Signup failed. Try again.");
    res.redirect("/signup");
  }
};

// Render login form
exports.renderLogin = (req, res) => {
  res.render("login");
};

// Handle login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    req.session.user = user;
    req.flash("success", "Welcome back!");
    res.redirect("/dashboard");
  } else {
    req.flash("error", "Invalid credentials.");
    res.redirect("/login");
  }
};

// Render dashboard after login
exports.dashboard = (req, res) => {
  if (!req.session.user) {
    req.flash("error", "You must log in first.");
    return res.redirect("/login");
  }
  res.render("dashboard", { user: req.session.user });
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
