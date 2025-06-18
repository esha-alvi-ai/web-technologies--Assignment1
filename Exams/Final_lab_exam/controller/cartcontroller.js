const Product = require("../models/product.model");
const Order = require("../models/Order");

module.exports = {
  // ✅ View Cart
  viewCart: (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
    });

    res.render("admin/cart", {
      cart,
      total,
    });
  },

  // ✅ Add to Cart
  addToCart: async (req, res) => {
    const productId = req.body.productId || req.params.id;

    try {
      const product = await Product.findById(productId);
      if (!product) {
        req.flash("error", "Product not found.");
        return res.redirect("/admin/product");
      }

      if (!req.session.cart) req.session.cart = [];

      const existingIndex = req.session.cart.findIndex(p => p._id === productId);

      if (existingIndex > -1) {
        req.session.cart[existingIndex].quantity += 1;
      } else {
        req.session.cart.push({
          _id: product._id.toString(),
          name: product.name,
          price: product.price,
          quantity: 1,
        });
      }

      req.flash("success", "Added to cart!");
      res.redirect("/admin/cart");
    } catch (error) {
      console.error("❌ Add to cart error:", error);
      req.flash("error", "Something went wrong.");
      res.redirect("/admin/product");
    }
  },

  // ✅ Remove from Cart
  removeFromCart: (req, res) => {
    const productId = req.params.id;
    if (req.session.cart) {
      req.session.cart = req.session.cart.filter(item => item._id !== productId);
    }
    req.flash("success", "Item removed from cart.");
    res.redirect("/admin/cart");
  },

  // ✅ Clear Cart
  clearCart: (req, res) => {
    req.session.cart = [];
    req.flash("success", "Cart cleared.");
    res.redirect("/admin/cart");
  },

  // ✅ Checkout View
  checkout: (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);

    res.render("admin/checkout", {
      cart,
      total,
    });
  },

  // ✅ Checkout Submit
  processCheckout: async (req, res) => {
    const { name, email, address } = req.body;
    const cart = req.session.cart || [];

    if (!cart.length) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/admin/cart");
    }

    const order = new Order({
      customer: { name, email, address },
      items: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      })),
      totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    });

    try {
      await order.save();
      req.session.cart = [];
      req.flash("success", "Order placed successfully!");
      res.redirect("/admin/order");
    } catch (err) {
      console.error("❌ Checkout error:", err);
      req.flash("error", "Could not place order.");
      res.redirect("/admin/checkout");
    }
  }
};
