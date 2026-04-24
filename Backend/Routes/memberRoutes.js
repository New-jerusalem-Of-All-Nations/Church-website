const express = require("express");
const router = express.Router();
const Member = require("../Models/memberModels");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// ============================================
// GET ALL MEMBERS (DASHBOARD)
// ============================================
router.get("/", auth, async (req, res) => {
  try {
    const { status, department, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = {};    
    
    if (status) {
      filter.status = status;
    }
    
    if (department) {
      filter.departments = department;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Fetch members with pagination
    const members = await Member.find(filter)
      .populate("departments", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    // Get total count for pagination
    const total = await Member.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
      error: error.message
    });
  }
});

// ============================================
// GET MEMBER STATS FOR DASHBOARD
// ============================================
router.get("/stats", auth, async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: "active" });
    const inactiveMembers = await Member.countDocuments({ status: "inactive" });
    const visitorMembers = await Member.countDocuments({ status: "visitor" });
    const baptizedMembers = await Member.countDocuments({ baptized: true });
    
    // Get recent members (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newMembers = await Member.countDocuments({ 
      membershipDate: { $gte: sevenDaysAgo } 
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers,
        visitorMembers,
        baptizedMembers,
        newMembersLastWeek: newMembers
      }
    });
  } catch (error) {
    console.error("Error fetching member stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch member statistics",
      error: error.message
    });
  }
});

// POST create new member
router.post("/", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    // Normalize field names - accept both firstName/lastName and name/surname
    const normalizedData = { ...req.body };
    if (normalizedData.firstName) {
      normalizedData.name = normalizedData.firstName;
      delete normalizedData.firstName;
    }
    if (normalizedData.lastName) {
      normalizedData.surname = normalizedData.lastName;
      delete normalizedData.lastName;
    }

    const { name, surname, email, phone, ...rest } = normalizedData;

    if (!name || !surname || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Required fields missing: name, surname, email, phone" 
      });
    }

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already exists" 
      });
    }

    const member = new Member({ name, surname, email, phone, ...rest });
    const savedMember = await member.save();
    const populatedMember = await Member.findById(savedMember._id).populate("departments");

    res.status(201).json({ success: true, data: populatedMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// GET SINGLE MEMBER BY ID
// ============================================
router.get("/:id", auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate("departments", "name");
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch member",
      error: error.message
    });
  }
});

// PUT update member
router.put("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    console.log("🔵 PUT /members/:id - Update request received");
    console.log("Member ID:", req.params.id);
    console.log("Request body:", req.body);

    // First, get the current member to check address format
    const currentMember = await Member.findById(req.params.id);
    if (!currentMember) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Normalize field names - accept both firstName/lastName and name/surname
    const normalizedData = { ...req.body };
    if (normalizedData.firstName) {
      normalizedData.name = normalizedData.firstName;
      delete normalizedData.firstName;
    }
    if (normalizedData.lastName) {
      normalizedData.surname = normalizedData.lastName;
      delete normalizedData.lastName;
    }

    const allowedFields = [
      "name",
      "surname",
      "email",
      "phone",
      "dateOfBirth",
      "gender",
      "status",
      "baptized",
      "departments",
      "notes"
    ];

    // Build update object
    const updateData = {};
    
    // Handle top-level fields
    allowedFields.forEach(field => {
      if (normalizedData.hasOwnProperty(field)) {
        updateData[field] = normalizedData[field];
      }
    });

    // Handle address - convert to proper object structure
    let addressToSet = { ...currentMember.address } || { street: '', city: '', state: '', zipCode: '' };

    // If address comes as a string, convert it to street
    if (typeof addressToSet !== 'object' || addressToSet === null) {
      addressToSet = { street: addressToSet || '', city: '', state: '', zipCode: '' };
    }

    // Update address fields from request
    if (normalizedData.address && typeof normalizedData.address === 'string') {
      addressToSet.street = normalizedData.address;
    }
    if (normalizedData.city) {
      addressToSet.city = normalizedData.city;
    }
    if (normalizedData.state) {
      addressToSet.state = normalizedData.state;
    }
    if (normalizedData.zipCode) {
      addressToSet.zipCode = normalizedData.zipCode;
    }

    // Also check for nested address object
    if (normalizedData.address && typeof normalizedData.address === 'object') {
      addressToSet = { ...addressToSet, ...normalizedData.address };
    }

    // Set the entire address object (not using dot notation to avoid string field issue)
    updateData.address = addressToSet;

    console.log("Address conversion:", { 
      currentAddress: currentMember.address,
      newAddress: addressToSet
    });
    console.log("Update data prepared:", updateData);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No valid fields to update provided",
        receivedFields: Object.keys(req.body)
      });
    }

    // Use findByIdAndUpdate with explicit options
    const member = await Member.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    ).populate("departments");

    if (!member) {
      console.log("❌ Member not found:", req.params.id);
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    console.log("✅ Member updated successfully");
    console.log("Updated member:", { 
      id: member._id, 
      name: member.name, 
      surname: member.surname,
      address: member.address
    });

    res.status(200).json({ 
      success: true, 
      data: member,
      message: "Member updated successfully"
    });
  } catch (error) {
    console.error("❌ Error updating member:", error);
    
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already exists" 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.errors || error
    });
  }
});

// DELETE member
router.delete("/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({ 
        success: false, 
        message: "Member not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Member deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
