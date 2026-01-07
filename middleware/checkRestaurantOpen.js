
const RestaurantSettings = require("../models/RestaurantSettings");


const isWithinTime = (open, close) => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);

  const openMinutes = oh * 60 + om;
  const closeMinutes = ch * 60 + cm;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
};

module.exports = async (req, res, next) => {
  try {
    const settings = await RestaurantSettings.findOne();

    if (!settings || !settings.isOpen) {
      return res.status(403).json({ message: "Restaurant is currently closed" });
    }

    if (!isWithinTime(settings.openTime, settings.closeTime)) {
      return res.status(403).json({
        message: `Orders allowed only between ${settings.openTime} - ${settings.closeTime}`,
      });
    }

    next(); 
  } catch (err) {
    console.error("Restaurant check error:", err);
    res.status(500).json({ message: "Failed to check restaurant status" });
  }
};
