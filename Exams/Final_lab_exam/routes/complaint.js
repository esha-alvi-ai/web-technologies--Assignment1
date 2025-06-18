const mongoose = require("mongoose");



const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Order = require('../models/Order');
const authorize = require('../middleware/authorize');
const isAdmin = require('../middleware/admin');

// Complaint Form
router.get('/', authorize, (req, res) => {
  res.render('complaint/form');
});
router.post('/', authorize, async (req, res) => {
  const { orderId, message } = req.body;

  try {
    const complaint = new Complaint({
      userId: req.session.user._id,
      orderId: new mongoose.Types.ObjectId(orderId), // ✅ Important fix
      message
    });

    await complaint.save();
    res.redirect('/complaints/mine');
  } catch (err) {
    console.error("Complaint save error:", err);
    res.redirect('/complaints');
  }
});


// View Own Complaints
router.get('/mine', authorize, async (req, res) => {
  const complaints = await Complaint.find({ userId: req.session.user._id }).populate('orderId');
  res.render('complaint/my_complaints', { complaints });
});

// Admin View All Complaints
router.get('/admin', authorize, isAdmin, async (req, res) => {
  const complaints = await Complaint.find().populate('userId').populate('orderId');
  res.render('complaint/all_complaints', { complaints });
});

module.exports = router;
