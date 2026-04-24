const express = require("express");
const router = express.Router();
const GetInTouch = require("../Models/getInTouchModels");
const auth = require("../middleware/auth");

// ADMIN: Get all messages
router.get("/", auth, async (req, res) => {
  try {
    const messages = await GetInTouch.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ADMIN: Delete message
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await GetInTouch.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
