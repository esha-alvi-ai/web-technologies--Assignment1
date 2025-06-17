
const Product = require("../models/product.model");
const Order = require("../models/Order");

module.exports = {
  viewCart: (req, res) => {
    res.render("cart"); 
  },

  checkout: (req, res) => {
    res.render("checkout");  
  },

  submitOrder: async (req, res) => {
    const cart = req.session.cart || [];
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      products: cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      })),
      totalPrice,
      customer: {
        name: req.body.name,
        email: req.session.user.email,
        address: req.body.address,
      }
    });

    await order.save();
    req.session.cart = []; 
    req.flash("success", "Order placed successfully!");
    res.redirect("/my-orders");
    res.render("admin/checkout");

  }
};
