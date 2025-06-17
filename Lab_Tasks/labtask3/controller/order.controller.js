const Order = require("../models/Order");

// Show all orders
exports.viewAllOrders = async (req, res) => {
  const orders = await Order.find().populate("products.productId");
  res.render("admin/order", { orders });
};

// Show order detail
exports.viewOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("products.productId");
  if (!order) {
    req.flash("error", "Order not found");
    return res.redirect("/admin/order");
  }
  res.render("admin/order-detail", { order });
};

// Show create form (Optional)
exports.showCreateForm = (req, res) => {
  res.render("admin/create-order");
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { name, email, address, products, totalPrice } = req.body;

    const order = new Order({
      customer: { name, email, address },
      products, // Make sure this is an array of { productId, quantity }
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

// Update order
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

// Delete order
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
