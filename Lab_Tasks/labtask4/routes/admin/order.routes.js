const express = require("express");
const router = express.Router();
const orderController = require("../../controller/order.controller");
const authorize = require("../../middleware/authorize");

// 🧾 User - Place an order (called from cartController originally)
router.post("/checkout", orderController.createOrder); // optional if not needed again

// 🔐 Admin Routes
router.get("/admin/order", authorize, orderController.viewAllOrders);
router.get("/admin/order/view/:id", authorize, orderController.viewOrder);
router.post("/admin/order/update/:id", authorize, orderController.updateOrder);
router.post("/admin/order/delete/:id", authorize, orderController.deleteOrder);

module.exports = router;
