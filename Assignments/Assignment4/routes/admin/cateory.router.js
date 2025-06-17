const express = require("express");
const router = express.Router();
const Category = require("../../models/Category");
const authorize = require("../../middleware/authorize");
const isAuthenticated = require("../../middleware/isAuthenticated"); // or use your existing one

// List all categories
router.get("/", isAuthenticated, async (req, res) => {
  const categories = await Category.find();
  res.render("admin/categories", { categories, layout: "layout", user: req.session.user });
});

// Show form to create category
router.get("/create", isAuthenticated, (req, res) => {
  res.render("admin/create-category", { layout: "layout" });
});

// Handle form submission
router.post("/create", isAuthenticated, async (req, res) => {
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.redirect("/admin/categories");
});

// Edit form
router.get("/edit/:id", isAuthenticated, async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("admin/edit-category", { category, layout: "layout" });
});

// Update category
router.post("/edit/:id", isAuthenticated, async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/categories");
});

// Delete category
router.get("/delete/:id", isAuthenticated, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect("/admin/categories");
});

module.exports = router;
