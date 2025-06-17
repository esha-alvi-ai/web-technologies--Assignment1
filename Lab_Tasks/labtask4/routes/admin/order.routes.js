const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");
const authorize = require("../middleware/authorize");

// User checkout
router.post("/checkout", orderController.createOrder);

// Admin
router.get("/admin/order", authorize, orderController.viewAllOrders);
router.get("/admin/order.detail/:id", authorize, orderController.viewOrder);
router.post("/admin/order/delete/:id", authorize, orderController.deleteOrder);
router.post("/admin/order/update/:id", authorize, orderController.updateOrder);

module.exports = router;
