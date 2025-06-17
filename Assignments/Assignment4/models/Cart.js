
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product.model' },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, default: 0 },
  customer: {
    name: String,
    email: String,
    address: String,
  },
});

module.exports = mongoose.model('Cart', cartSchema);
 