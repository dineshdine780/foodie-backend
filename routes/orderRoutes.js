const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const protectUser = require("../middleware/protectUser");
const RestaurantSettings = require("../models/RestaurantSettings");
const checkRestaurantOpen = require("../middleware/checkRestaurantOpen");


// router.post("/", protectUser, async (req, res) => {
//   try {
//     const { items, totalAmount, orderType, orderTime, paymentMethod } = req.body;

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     if (!orderType || !orderTime) {  
//        return res.status(400).json({ message: "Order type and time required" });
//     }

//     if (!paymentMethod) {
//         return res.status(400).json({ message: "Payment method required" });
//     }


//     const order = new Order({
//       userId: req.user._id,
//       items,
//       totalAmount,
//       orderType,
//       orderTime,
//       paymentMethod,
//     });

//     await order.save();

//     res.status(201).json({
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("ORDER ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

const isWithinTime = (open, close) => {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);

  return current >= oh * 60 + om && current <= ch * 60 + cm;
};



// router.post("/", protectUser, checkRestaurantOpen, async (req, res) => {
//   try {
//     const { items, totalAmount, orderType, orderTime, paymentMethod } = req.body;

//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ message: "User not authenticated" });
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.isActive) {
//       return res.status(403).json({ message: "Account is deactivated" });
//     }

//     if (!items || items.length === 0) {
//   return res.status(400).json({ message: "Cart is empty" });
// }

//     if (!orderType || !orderTime) {
//       return res.status(400).json({ message: "Order type and time required" });
//     }

//     if (!paymentMethod) {
//       return res.status(400).json({ message: "Payment method required" });
//     }

//     const today = new Date().toISOString().split("T")[0];

//     user.ordersToday = user.ordersToday || 0;
//     user.dailyOrderLimit = user.dailyOrderLimit || 5;

//     if (user.lastOrderDate !== today) {
//       user.ordersToday = 0;
//       user.lastOrderDate = today;
//     }

//     if (user.ordersToday >= user.dailyOrderLimit) {
//       return res.status(403).json({ message: "Daily order limit reached" });
//     }

    


//     const order = new Order({
//       userId: user._id,
//       items,
//       totalAmount,
//       orderType,
//       orderTime,
//       paymentMethod,
//     });

//     await order.save();

//     user.ordersToday += 1;
//     user.lastOrderDate = today;
//     await user.save();

//     res.status(201).json({
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("ORDER ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// });



router.post("/", protectUser, checkRestaurantOpen, async (req, res) => {
  try {
    const { items, totalAmount, orderType, orderTime, paymentMethod } = req.body;

    const user = await User.findById(req.user._id);
    if (!user || !user.isActive)
      return res.status(403).json({ message: "User not allowed to place order" });

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const today = new Date().toISOString().split("T")[0];
    user.ordersToday = user.ordersToday || 0;
    user.dailyOrderLimit = user.dailyOrderLimit || 5;

    if (user.lastOrderDate !== today) {
      user.ordersToday = 0;
      user.lastOrderDate = today;
    }

    if (user.ordersToday >= user.dailyOrderLimit)
      return res.status(403).json({ message: "Daily order limit reached" });

    const order = new Order({
      userId: user._id,
      items,
      totalAmount,
      orderType,
      orderTime,
      paymentMethod,
    });

    await order.save();

    user.ordersToday += 1;
    user.lastOrderDate = today;
    await user.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to place order" });
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
