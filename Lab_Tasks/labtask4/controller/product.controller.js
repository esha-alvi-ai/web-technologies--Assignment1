const Product = require("../models/product.model"); // ✅ Add this line

module.exports = {
  showProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.render("admin/product", { products, editProduct: null });
    } catch (err) {
      console.error("Error showing products:", err);
      res.status(500).send("Server Error");
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const image = req.file ? req.file.filename : null;
      const product = new Product({ name, description, price, image });
      await product.save();
      req.flash("success", "Product created!");
      res.redirect("/admin/product");
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).send("Server Error");
    }
  },

  showEditForm: async (req, res) => {
    try {
      const products = await Product.find();
      const product = await Product.findById(req.params.id);
      res.render("admin/product", { products, editProduct: product });
    } catch (err) {
      console.error("Error showing edit form:", err);
      res.status(500).send("Server Error");
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { name, description, price } = req.body;
      const updateData = { name, description, price };
      if (req.file) {
        updateData.image = req.file.filename;
      }
      await Product.findByIdAndUpdate(req.params.id, updateData);
      req.flash("success", "Product updated!");
      res.redirect("/admin/product");
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).send("Server Error");
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      req.flash("success", "Product deleted!");
      res.redirect("/admin/product");
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Server Error");
    }
  },
};
