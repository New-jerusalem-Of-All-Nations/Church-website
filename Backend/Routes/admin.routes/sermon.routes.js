const express = require("express");
const router = express.Router();
const Sermon = require("../Models/sermonModels");
const requireAuth = require("../middleware/auth.middleware");

// CREATE sermon
router.post("/", requireAuth, async (req, res) => {
  try {
    const sermon = new Sermon(req.body);
    const savedSermon = await sermon.save();
    res.status(201).json(savedSermon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE sermon
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Sermon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE sermon
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Sermon.findByIdAndDelete(req.params.id);
    res.json({ message: "Sermon deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
