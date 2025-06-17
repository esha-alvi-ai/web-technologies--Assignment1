const express = require("express");
const router = express.Router();

 
const authorize = require('../../middleware/authorize');
const Product = require("../../models/product.model");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart.js")

// Add to Cart
router.post('/add-to-cart/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');

    // Find or create cart
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ products: [], totalPrice: 0 });
    }

    // Check if product already exists in cart
    const cartItemIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (cartItemIndex > -1) {
      cart.products[cartItemIndex].quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    // Update total price
    cart.totalPrice += product.price;

    await cart.save();
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Get Cart
router.get('/cart', authorize, async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('products.productId');
    if (!cart) {
      return res.render('admin/cart', {
        products: [],
        totalPrice: 0,
        layout: "layout"
      });
    }

    res.render('admin/cart', {
      products: cart.products,
      totalPrice: cart.totalPrice,
      layout: "layout"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Checkout Page
router.get('/checkout', authorize, async (req, res) => {
  try {
    const cart = await Cart.findOne();
    if (!cart) return res.redirect('/cart');

    res.render('admin/checkout', {
      totalPrice: cart.totalPrice,
      layout: "layout"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Process Checkout
router.post('/checkout', authorize, async (req, res) => {
  const { name, email, address, payment } = req.body;

  try {
    const cart = await Cart.findOne().populate('products.productId');
    if (!cart) return res.redirect('/cart');

    const order = new Order({
      customer: {
        name,
        email,
        address
      },
      items: cart.products,
      totalPrice: cart.totalPrice,
      paymentMethod: payment
    });

    await order.save();

    // Clear the cart
    await Cart.deleteOne({ _id: cart._id });

    res.redirect(`/order-success/${order._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Order Success Page
router.get('/order-success/:orderId', authorize, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).send('Order not found');

    res.render('admin/order-success', {
      order,
      layout: "layout"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// All Orders
router.get('/orders', authorize, async (req, res) => {
  try {
    const orders = await Order.find();

    res.render('admin/orders', {
      orders,
      layout: "layout"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Order Details
router.get('/order-details/:id', authorize, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    res.render('admin/order-details', {
      order,
      layout: 'layout'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
