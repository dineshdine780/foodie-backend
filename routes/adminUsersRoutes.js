// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const protectAdmin = require("../middleware/protectAdmin");

// router.get("/users", protectAdmin, async (req, res) => {
//   try {
//     const users = await User.find().select("-password").sort({ createdAt: -1 });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch users" });
//   }
// });

// router.patch("/users/:id/activate", protectAdmin, async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { isActive: req.body.isActive },
//       { new: true }
//     );
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update user status" });
//   }
// })


// router.patch("/:id/order-limit", protectAdmin, async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { dailyOrderLimit: req.body.orderLimit }, 
//     { new: true }
//   );
//   res.json(user);
// });



// module.exports = router;




const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protectAdmin = require("../middleware/protectAdmin");


// router.get("/users", protectAdmin, async (req, res) => {
//   const users = await User.find().select("-password");
//   res.json(users);
// });

router.get("/users", protectAdmin, async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(users);
});



router.patch("/users/:id/activate", protectAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true }
  );
  res.json(user);
});


// router.patch("/:id/order-limit", protectAdmin, async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { dailyOrderLimit: req.body.dailyOrderLimit },
//     { new: true }
//   );
//   res.json(user);
// });

router.patch("/:id/order-limit", protectAdmin, async (req, res) => {
  const { dailyOrderLimit } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { dailyOrderLimit },
    { new: true }
  );

  res.json(user);
});



module.exports = router;
