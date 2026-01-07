const express = require("express");
const Food = require("../models/Food");
const protectAdmin = require("../middleware/protectAdmin");

const router = express.Router();


router.get("/public", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});


// router.get("/", protectAdmin, async (req, res) => {
//   const foods = await Food.find().sort({ createdAt: -1 });
//   res.json(foods);   
// });


router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});
 
 
 
router.post("/", protectAdmin, async (req, res) => {
  const { name, price, image, category } = req.body;

  const food = await Food.create({
    name,
    price,
    image,
    category,
  });

  res.json(food);
});


router.delete("/:id", protectAdmin, async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ message: "Food deleted" });
});


module.exports = router;