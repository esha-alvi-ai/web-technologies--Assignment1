


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product.model' },
      quantity: Number,
    },
  ],
  totalPrice: Number,
  customer: {
    name: String,
    email: String,
    address: String,
  },
});

module.exports = mongoose.model('Order', orderSchema);



