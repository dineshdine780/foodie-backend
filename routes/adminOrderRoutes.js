const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protectAdmin = require("../middleware/protectAdmin");


router.get("/orders", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json(orders);  
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" }); 
  }
});



router.get("/dashboard", protectAdmin, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = todayRevenueAgg[0]?.total || 0;

    const users = await require("../models/User").countDocuments();
    const menuItems = await require("../models/Food").countDocuments();

    res.json({
      totalOrders: todayOrders,   
      totalRevenue,               
      users,
      menuItems
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error" });
  }
});

  
   
   
router.put("/orders/:id/status", protectAdmin, async (req, res) => { 
  try {
    const { status } = req.body;
   
    const order = await Order.findById(req.params.id);
    if (!order) { 
      return res.status(404).json({ message: "Order not found" });
    }  
     
    order.status = status;
    await order.save();
      
    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
}); 
   
module.exports = router;