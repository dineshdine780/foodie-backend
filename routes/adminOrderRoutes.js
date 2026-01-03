const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protectAdmin = require("../middleware/protectAdmin");


router.get("/orders", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    res.json(orders);  
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" }); 
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