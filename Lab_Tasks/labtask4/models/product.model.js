const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String, // store image filename
});

module.exports = mongoose.model("product", productSchema);
