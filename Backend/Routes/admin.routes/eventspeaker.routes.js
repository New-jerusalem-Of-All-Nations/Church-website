const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Speaker = require("../Models/eventSpeakerModels");
const requireAuth = require("../middleware/auth.middleware");

const router = express.Router();

/* MULTER CONFIG*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
});

/*  CREATE SPEAKER*/
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const speaker = await Speaker.create({
        name: req.body.name,
        title: req.body.title,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      });

      res.status(201).json(speaker);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

/*UPDATE SPEAKER*/
router.put(
  "/:id",
  requireAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const speaker = await Speaker.findById(req.params.id);
      if (!speaker) {
        return res.status(404).json({ message: "Speaker not found" });
      }

      // Replace image if new one uploaded
      if (req.file && speaker.image) {
        const oldPath = path.join(
          __dirname,
          "..",
          speaker.image
        );
        fs.existsSync(oldPath) && fs.unlinkSync(oldPath);
        speaker.image = `/uploads/${req.file.filename}`;
      }

      speaker.name = req.body.name ?? speaker.name;
      speaker.title = req.body.title ?? speaker.title;

      await speaker.save();
      res.json(speaker);

    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

/* DELETE SPEAKER*/
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }

    // Remove image file
    if (speaker.image) {
      const imgPath = path.join(__dirname, "..", speaker.image);
      fs.existsSync(imgPath) && fs.unlinkSync(imgPath);
    }

    await speaker.deleteOne();
    res.json({ message: "Speaker deleted" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
