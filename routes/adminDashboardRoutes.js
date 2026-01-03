const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");
const Food = require("../models/Food");
const protectAdmin = require("../middleware/protectAdmin");



router.get("/dashboard", protectAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const menuItems = await Food.countDocuments();

    const revenueAgg = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalOrders,
      totalRevenue,
      menuItems,
      users: totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard stats failed" });
  }
});



router.get("/recent-orders", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent orders" });
  }
});

module.exports = router;