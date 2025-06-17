const Product = require("../models/product.model");
const Order = require("../models/Order");

module.exports = {
  viewCart: (req, res) => {
    res.render("admin/cart"); 
  },

  checkout: (req, res) => {
    res.render("admin/checkout");  
  },



  // ✅ FIXED: Added missing comma before this
  addToCart: async (req, res) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/admin/product");
    }


    

    req.flash("success", "Added to cart!");
    res.redirect("/admin/cart");
  },
};
