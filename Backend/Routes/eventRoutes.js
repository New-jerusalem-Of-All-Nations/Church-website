const express = require("express");
const router = express.Router();
const Event = require("../Models/eventsModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

console.log("✅ eventRoutes.js loaded - router ready");

// GET all events (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, published } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    // Only filter by published if explicitly requested (for production)
    // For now, return all events unless ?published=true is specified
    if (published === 'true') {
      filter.isPublished = true;
    }
    
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const events = await Event.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ date: -1 });

    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: events,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
      _TEST_MARKER: "CODE_VERSION_20260309_LATEST_WITH_ALL_EVENTS"
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single event (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || !event.isPublished) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create event (ADMIN ONLY)
router.post("/", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { title, date, ...rest } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: "Title and date are required" });
    }

    const event = new Event({ title, date, ...rest });
    const savedEvent = await event.save();

    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update event (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE event (ADMIN ONLY)
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
