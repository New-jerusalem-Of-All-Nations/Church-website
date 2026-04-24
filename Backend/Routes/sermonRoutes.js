const express = require("express");
const router = express.Router();
const Sermon = require("../Models/sermonModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// GET all sermons (PUBLIC)
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/sermons - Fetching sermons");
    
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    
    const sermons = await Sermon.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ date: -1 });

    const total = await Sermon.countDocuments(filter);

    console.log(`Found ${sermons.length} sermons`);
    
    res.status(200).json({
      success: true,
      data: sermons,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
    
  } catch (error) {
    console.error("Error fetching sermons:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single sermon (PUBLIC)
router.get("/:id", async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!sermon) {
      return res.status(404).json({ success: false, message: "Sermon not found" });
    }

    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    console.error("Error fetching sermon:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create new sermon (ADMIN ONLY)
router.post("/", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    console.log("POST /api/sermons - Creating new sermon");
    
    const { title, speaker, date, ...rest } = req.body;

    if (!title || !speaker || !date) {
      return res.status(400).json({ success: false, message: "Title, speaker, and date are required" });
    }

    const sermon = new Sermon({ title, speaker, date, ...rest });
    const savedSermon = await sermon.save();
    
    console.log("Sermon created successfully:", savedSermon._id);
    res.status(201).json({ success: true, data: savedSermon });
    
  } catch (error) {
    console.error("Error creating sermon:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT update sermon (ADMIN ONLY)
router.put("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    console.log("PUT /api/sermons/:id - Updating sermon");

    const sermon = await Sermon.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!sermon) {
      return res.status(404).json({ success: false, message: "Sermon not found" });
    }

    console.log("Sermon updated successfully:", sermon._id);
    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    console.error("Error updating sermon:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE sermon (ADMIN ONLY)
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    console.log("DELETE /api/sermons/:id - Deleting sermon");

    const sermon = await Sermon.findByIdAndDelete(req.params.id);

    if (!sermon) {
      return res.status(404).json({ success: false, message: "Sermon not found" });
    }

    console.log("Sermon deleted successfully:", sermon._id);
    res.status(200).json({ success: true, message: "Sermon deleted successfully" });
  } catch (error) {
    console.error("Error deleting sermon:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;