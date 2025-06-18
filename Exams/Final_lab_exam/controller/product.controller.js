


const Product = require("../models/product.model");

// Show all products or with edit form
exports.showProducts = async (req, res) => {
  const products = await Product.find();
  res.render("admin/product", { products, editProduct: null });
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const editProduct = await Product.findById(req.params.id);
    const products = await Product.find(); // For listing below form
    if (!editProduct) {
      req.flash("error", "Product not found.");
      return res.redirect("/admin/product");
    }
    res.render("admin/product", { editProduct, products });
  } catch (err) {
    console.error(err);
    req.flash("error", "Error loading product.");
    res.redirect("/admin/product");
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const update = { name, description, price };
    if (req.file) {
      update.image = req.file.filename;
    }
    await Product.findByIdAndUpdate(req.params.id, update);
    req.flash("success", "Product updated successfully.");
    res.redirect("/admin/product");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update product.");
    res.redirect("/admin/product");
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;
    await new Product({ name, description, price, image }).save();
    req.flash("success", "Product added.");
    res.redirect("/admin/product");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add product.");
    res.redirect("/admin/product");
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted.");
    res.redirect("/admin/product");
  } catch (err) {
    console.error(err);
    req.flash("error", "Deletion failed.");
    res.redirect("/admin/product");
  }
};
