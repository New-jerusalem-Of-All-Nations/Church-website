const express = require("express");
const Admin = require("../Models/adminModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

const router = express.Router();

// GET all admins (SUPERADMIN ONLY)
router.get("/", auth, role("superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    const admins = await Admin.find(filter)
      .limit(limit)
      .skip(skip)
      .select("-password")
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: admins,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET single admin (SUPERADMIN ONLY)
router.get("/:id", auth, role("superAdmin"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error("Get admin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST create admin (SUPERADMIN ONLY)
router.post("/create-admin", auth, role("superAdmin"), async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({ email, password });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: {
        id: admin._id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT update admin (SUPERADMIN ONLY)
router.put("/:id", auth, role("superAdmin"), async (req, res) => {
  try {
    const allowedFields = ["email", "status"];
    
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    });

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE admin (SUPERADMIN ONLY)
router.delete("/:id", auth, role("superAdmin"), async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
