const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", complaintSchema);
