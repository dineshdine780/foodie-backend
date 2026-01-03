const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();



router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Admin created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
 
 
 
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    const admin = await Admin.findOne({ email});
    if (!admin){
        return res.status(400).json({message: "Admin not found"});
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch){ 
        return res.status(400).json({message: "Invalid credentials"});
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({token}); 
});    

module.exports = router; 