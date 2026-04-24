const express = require("express");
const router = express.Router();
const GetInTouch = require("../Models/getInTouchModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// GET all messages (ADMIN ONLY)
router.get("/", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }
    if (status) filter.status = status;

    const messages = await GetInTouch.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await GetInTouch.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: messages,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    console.error("Get in touch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// GET single message (ADMIN ONLY)
router.get("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const message = await GetInTouch.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error("Get in touch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// PUBLIC: Submit contact message
router.post("/", async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newMessage = await GetInTouch.create({ fullName, email, message });

    res.status(201).json({
      success: true,
      message: "Thank you for getting in touch",
      data: newMessage
    });
  } catch (error) {
    console.error("Get in touch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// PUT update message status/notes (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const allowedFields = ["status", "notes", "response"];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    });

    const message = await GetInTouch.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error("Get in touch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// DELETE message (ADMIN ONLY)
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const message = await GetInTouch.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("Get in touch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
