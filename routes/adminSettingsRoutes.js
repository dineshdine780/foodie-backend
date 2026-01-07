const express = require("express");
const router = express.Router();
const RestaurantSettings = require("../models/RestaurantSettings");
const protectAdmin = require("../middleware/protectAdmin");


router.get("/restaurant", protectAdmin, async (req, res) => {
  try {
    let settings = await RestaurantSettings.findOne();

   
    if (!settings) {
      settings = await RestaurantSettings.create({
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: true,
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
});



router.get("/restaurant/public", async (req, res) => {
  try {
    const settings = await RestaurantSettings.findOne();

    if (!settings) {
      return res.json({
        openTime: "09:00",
        closeTime: "22:00",
        isOpen: false,
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch restaurant status" });
  }
});



router.put("/restaurant", protectAdmin, async (req, res) => {
  try {
    const { openTime, closeTime, isOpen } = req.body;

    let settings = await RestaurantSettings.findOne();

    if (!settings) {
      settings = new RestaurantSettings();
    }

    settings.openTime = openTime;
    settings.closeTime = closeTime;
    settings.isOpen = isOpen;

    await settings.save();

    res.json({ message: "Restaurant settings updated", settings });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
