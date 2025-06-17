const Order = require("../models/Order");
const Product = require("../models/product.model");
// Show all orders
exports.viewAllOrders = async (req, res) => {
  const orders = await Order.find().populate("products.productId");
  res.render("admin/order", { orders });
};

// Show single order detail
exports.viewOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("products.productId");
  if (!order) {
    req.flash("error", "Order not found");
    return res.redirect("/admin/order");
  }
  res.render("admin/order-detail", { order });
};

// Show create order form (admin only)
exports.showCreateForm = (req, res) => {
  res.render("admin/create-order");
};

// Create order (admin)
exports.createOrder = async (req, res) => {
  try {
    const { name, email, address, products, totalPrice } = req.body;

    const order = new Order({
      customer: { name, email, address },
      products, // Should be array of { productId, quantity }
      totalPrice,
    });

    await order.save();
    req.flash("success", "Order created successfully!");
    res.redirect("/admin/order");
  } catch (err) {
    console.error(err);
    req.flash("error", "Error creating order.");
    res.redirect("/admin/order");
  }
};

// Update order (admin)
exports.updateOrder = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Order updated.");
    res.redirect("/admin/order");
  } catch (err) {
    console.error(err);
    req.flash("error", "Update failed.");
    res.redirect("/admin/order");
  }
};

// Delete order (admin)
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.flash("success", "Order deleted.");
    res.redirect("/admin/order");
  } catch (err) {
    console.error(err);
    req.flash("error", "Deletion failed.");
    res.redirect("/admin/order");
  }
};
