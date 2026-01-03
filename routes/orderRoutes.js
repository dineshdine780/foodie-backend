const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const protectUser = require("../middleware/protectUser");


router.post("/", protectUser, async (req, res) => {
  try {
    const { items, totalAmount, orderType, orderTime } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!orderType || !orderTime) {
  return res.status(400).json({ message: "Order type and time required" });
}

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount,
      orderType,
      orderTime,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});



router.get("/my-orders", protectUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


router.get("/public", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  } 
}); 

 
router.put("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" }); 
  }
});  
 
  
module.exports = router;  



// const express = require("express");
// const Order = require("../models/Order");
// const protectUser = require("../middleware/protectUser");

// const router = express.Router();


// router.post("/", protectUser, async (req, res) => {
//   try {
//     const { items, totalAmount } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     const order = await Order.create({
//       userId: req.user._id,
//       items,
//       totalAmount,
//     });

//     res.status(201).json(order);
//   } catch (error) {
//     console.error("ORDER ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// });



// router.get("/my-orders", protectUser, async (req, res) => {
//   const orders = await Order.find({ userId: req.user._id }).sort({
//     createdAt: -1,
//   });
//   res.json(orders);
// });

// module.exports = router;

