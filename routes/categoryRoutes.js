const express = require("express");
const Category = require("../models/Category");
const protectAdmin = require("../middleware/protectAdmin");

const router = express.Router();

router.get("/", protectAdmin, async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
});


router.get("/public", async (req, res) => { 
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error) { 
    res.status(500).json({ message: "Failed to fetch categories" }); 
  }  
});
   
   
router.post("/", protectAdmin, async (req, res) => {
  const { name } = req.body; 
   
  if (!name) {
    return res.status(400).json({ message: "Category name required" });
  }

  const exists = await Category.findOne({ name });
  if (exists) {
    return res.status(400).json({ message: "Category already exists" });
  } 

  const category = await Category.create({ name }); 
  res.json(category);
}); 


router.delete("/:id", protectAdmin, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
});


router.put("/:id", protectAdmin, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name required" });
  } 

  const updatedCategory = await Category.findByIdAndUpdate( 
    req.params.id,
    { name },
    { new: true } 
  );  

  res.json(updatedCategory);
});

module.exports = router;