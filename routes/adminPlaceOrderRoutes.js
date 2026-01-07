const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protectAdmin = require("../middleware/protectAdmin");



router.post("/orders", protectAdmin, async (req, res) => {
  try {
    const {
      guestName,
      guestPhone,
      items,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!guestName || !guestPhone || !items || !totalAmount) {
      return res.status(400).json({ message: "All fields required" });
    }

    const order = await Order.create({
      placedBy: "admin",
      guestName,
      guestPhone,
      items,
      totalAmount,
      paymentMethod,
      orderType: "Admin Order",
      orderTime: new Date().toLocaleTimeString(),
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("ADMIN ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});


module.exports = router;