

const Category = require("../models/category.model");


exports.showCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("admin/categories", { categories });
  } catch (err) {
    console.error("Error showing categories:", err);
    req.flash("error", "Failed to load categories.");
    res.redirect("/dashboard");
  }
};

exports.showCreateForm = (req, res) => {
  res.render("admin/create-category");
};


exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    req.flash("success", "Category created successfully!");
    res.redirect("/admin/category");
  } catch (err) {
    console.error("Error creating category:", err);
    req.flash("error", "Failed to create category.");
    res.redirect("/admin/category");
  }
};


exports.showEditForm = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect("/admin/category");
    }
    res.render("admin/edit-category", { category });
  } catch (err) {
    console.error("Error loading edit form:", err);
    req.flash("error", "Failed to load edit form.");
    res.redirect("/admin/category");
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Category.findByIdAndUpdate(req.params.id, { name, description });
    req.flash("success", "Category updated!");
    res.redirect("/admin/category");
  } catch (err) {
    console.error("Error updating category:", err);
    req.flash("error", "Failed to update category.");
    res.redirect("/admin/category");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("success", "Category deleted!");
    res.redirect("/admin/category");
  } catch (err) {
    console.error("Error deleting category:", err);
    req.flash("error", "Failed to delete category.");
    res.redirect("/admin/category");
  }
};
