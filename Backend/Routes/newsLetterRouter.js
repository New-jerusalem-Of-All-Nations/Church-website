const express = require("express");
const Newsletter = require("../Models/newsLetterModels");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// GET all subscribers (ADMIN ONLY)
router.get("/", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }
    if (status) filter.status = status;

    const subscribers = await Newsletter.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Newsletter.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// GET single subscriber (ADMIN ONLY)
router.get("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      });
    }

    res.status(200).json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

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

    const subscriber = await Newsletter.create({ email: normalizedEmail });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed",
      data: subscriber
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// PUT update subscriber status (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const allowedFields = ["status", "notes"];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    });

    const subscriber = await Newsletter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      });
    }

    res.status(200).json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// DELETE unsubscribe (can be called by admin or subscriber)
router.delete("/:id", async (req, res) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed"
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
