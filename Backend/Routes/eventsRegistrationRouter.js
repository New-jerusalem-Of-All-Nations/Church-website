const express = require("express");
const router = express.Router();
const EventRegistration = require("../Models/eventsRegistationModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// GET all event registrations (ADMIN ONLY)
router.get("/", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, eventId, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (eventId) filter.eventId = eventId;
    if (status) filter.status = status;

    const registrations = await EventRegistration.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await EventRegistration.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: registrations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    console.error("Event registration error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET single registration (ADMIN ONLY)
router.get("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST register for event (PUBLIC)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, eventId, ...rest } = req.body;

    if (!firstName || !lastName || !email || !eventId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing: firstName, lastName, email, eventId"
      });
    }

    const newRegistration = await EventRegistration.create({
      firstName,
      lastName,
      email,
      eventId,
      ...rest
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: newRegistration
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// PUT update registration (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const allowedFields = ["status", "notes", "attended"];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    });

    const registration = await EventRegistration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    res.status(200).json({
      success: true,
      data: registration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE registration (ADMIN ONLY)
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const registration = await EventRegistration.findByIdAndDelete(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
