const express = require("express");
const router = express.Router();
const EventRegistration = require("../Models/eventsRegistationModels");
const auth = require("../middleware/auth");

// Get all registrations (ADMIN)
router.get("/", auth, async (req, res) => {
  try {
    const registrations = await EventRegistration.find()
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single registration (ADMIN)
router.get("/:id", auth, async (req, res) => {
  try {
    const registration = await EventRegistration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete registration (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await EventRegistration.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
