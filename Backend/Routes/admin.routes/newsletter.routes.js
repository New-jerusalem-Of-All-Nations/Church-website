const express = require("express");
const Newsletter = require("../Models/newsLetterModels");
const router = express.Router();

// PUBLIC: Subscribe to newsletter
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const exists = await Newsletter.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Email already subscribed",
      });
    }

    await Newsletter.create({ email: normalizedEmail });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
