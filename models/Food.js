const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Food", foodSchema);
