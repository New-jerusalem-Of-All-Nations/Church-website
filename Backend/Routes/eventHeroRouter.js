const express = require("express");
const multer = require("multer");
const Hero = require("../Models/eventHeroModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// Multer storage for background image
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// GET all hero sections (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: heroes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single hero (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }

    res.status(200).json({ success: true, data: hero });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET latest hero section (PUBLIC)
router.get("/latest", async (req, res) => {
  try {
    const hero = await Hero.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: hero });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create hero section (ADMIN ONLY)
router.post("/", auth, role("admin", "superAdmin"), upload.single("backgroundImage"), async (req, res) => {
  try {
    const { title, subtitle, scripture, registerBtnText, learnBtnText, registerBtnLink, learnBtnLink } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title and background image are required"
      });
    }

    const hero = await Hero.create({
      backgroundImage: `/uploads/${req.file.filename}`,
      title,
      subtitle,
      scripture,
      registerBtnText,
      learnBtnText,
      registerBtnLink,
      learnBtnLink
    });

    res.status(201).json({ success: true, data: hero });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update hero section (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), upload.single("backgroundImage"), async (req, res) => {
  try {
    const updateData = {};

    if (req.body.title) updateData.title = req.body.title;
    if (req.body.subtitle) updateData.subtitle = req.body.subtitle;
    if (req.body.scripture) updateData.scripture = req.body.scripture;
    if (req.body.registerBtnText) updateData.registerBtnText = req.body.registerBtnText;
    if (req.body.learnBtnText) updateData.learnBtnText = req.body.learnBtnText;
    if (req.body.registerBtnLink) updateData.registerBtnLink = req.body.registerBtnLink;
    if (req.body.learnBtnLink) updateData.learnBtnLink = req.body.learnBtnLink;
    if (req.file) updateData.backgroundImage = `/uploads/${req.file.filename}`;

    const hero = await Hero.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }

    res.status(200).json({ success: true, data: hero });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE hero section (ADMIN ONLY)
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: "Hero section not found"
      });
    }

    res.status(200).json({ success: true, message: "Hero section deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
