const express = require("express");
const User = require("../Models/userModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// CREATE ADMIN (SUPER ADMIN ONLY)
router.post("/create-admin", auth, role("superAdmin"), async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
