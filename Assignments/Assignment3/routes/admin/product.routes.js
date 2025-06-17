const express = require("express");
const router = express.Router();
const Product = require("../../models/product.model");
const Category = require("../../models/Category");
const authorize = require("../../middleware/authorize");
const isAdmin = require("../../middleware/admin");
const upload = require("../../middleware/upload");

// Redirect root to product list
router.get("/", (req, res) => res.redirect("/admin/product/list"));

// Product List
router.get("/list/:page?", authorize, isAdmin, async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const pageSize = 5;
  const { search = "", minPrice = 0, maxPrice = Infinity, sort = "title", order = "asc" } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };

  try {
    const totalRecords = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("category");

    res.render("admin/product", {
      layout: "layout",
      products,
      user: req.session.user,
      page,
      totalPages: Math.ceil(totalRecords / pageSize),
      totalRecords,
      searchQuery: search,
      minPrice,
      maxPrice,
      sortField: sort,
      sortOrder: order,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error loading products");
  }
});

// Create Product
router.get("/create", authorize, isAdmin, async (req, res) => {
  const categories = await Category.find();
  res.render("admin/createpro", { layout: "layout", categories });
});

router.post("/create", authorize, isAdmin, upload.single("picture"), async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      isFeatured: Boolean(req.body.isFeatured),
      category: req.body.category,
      picture: req.file ? "/uploads/" + req.file.filename : null,
    });
    await product.save();
    req.flash("success", "Product created successfully.");
    res.redirect("/admin/product/list");
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Error creating product");
  }
});

// Edit Product
router.get("/edit/:id", authorize, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    const categories = await Category.find();
    if (!product) return res.status(404).send("Product not found.");
    res.render("admin/edit-product", { layout: "layout", product, categories });
  } catch (err) {
    console.error("Error loading product:", err);
    res.status(500).send("Error loading product");
  }
});

router.post("/edit/:id", authorize, isAdmin, upload.single("picture"), async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      isFeatured: Boolean(req.body.isFeatured),
      category: req.body.category,
    };
    if (req.file) updateData.picture = "/uploads/" + req.file.filename;

    await Product.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", "Product updated successfully.");
    res.redirect("/admin/product/list");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
});

// Delete Product
router.get("/delete/:id", authorize, isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "Product deleted.");
    res.redirect("back");
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Error deleting product");
  }
});

module.exports = router;
