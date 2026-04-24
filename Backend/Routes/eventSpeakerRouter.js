const express = require("express");
const multer = require("multer");
const Speaker = require("../Models/eventSpeakerModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// GET all speakers (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } }
      ];
    }

    const speakers = await Speaker.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Speaker.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: speakers,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single speaker (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker not found"
      });
    }

    res.status(200).json({ success: true, data: speaker });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a speaker (ADMIN ONLY)
router.post("/", auth, role("admin", "superAdmin"), upload.single("image"), async (req, res) => {
  try {
    const { name, title } = req.body;

    if (!name || !title) {
      return res.status(400).json({
        success: false,
        message: "Name and title are required"
      });
    }

    const speakerData = {
      name,
      title,
    };

    if (req.file) {
      speakerData.image = `/uploads/${req.file.filename}`;
    }

    const speaker = await Speaker.create(speakerData);

    res.status(201).json({ success: true, data: speaker });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update speaker (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), upload.single("image"), async (req, res) => {
  try {
    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.title) updateData.title = req.body.title;
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const speaker = await Speaker.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!speaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker not found"
      });
    }

    res.status(200).json({ success: true, data: speaker });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE speaker (ADMIN ONLY)
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);

    if (!speaker) {
      return res.status(404).json({
        success: false,
        message: "Speaker not found"
      });
    }

    res.status(200).json({ success: true, message: "Speaker deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
