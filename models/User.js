const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: { type: Boolean, default: false },  
    dailyOrderLimit: { type: Number, default: 5 }, 
    ordersToday: { type: Number, default: 0 }, 

    lastOrderDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);