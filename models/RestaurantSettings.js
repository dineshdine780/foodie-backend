const mongoose = require("mongoose");

const restaurantSettingsSchema = new mongoose.Schema({
  openTime: {
    type: String, 
    required: true,
  },
  closeTime: {
    type: String, 
    required: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
});


module.exports = mongoose.model(
  "RestaurantSettings",
  restaurantSettingsSchema
);