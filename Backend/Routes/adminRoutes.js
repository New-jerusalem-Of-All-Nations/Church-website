const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Import Models
const Member = require("../Models/memberModels");
const Event = require("../Models/eventsModels");
const Announcement = require("../Models/announcementModels");
const Donation = require("../Models/donationModels");
const Subscription = require("../Models/subscriptionModels");
const Department = require("../Models/departmentModels");
const PrayerRequest = require("../Models/prayerRequestModels");
const Notification = require("../Models/notificationModels");
const User = require("../Models/userModels");

// ============================================
// MEMBERS ENDPOINTS (7)
// ============================================

// POST bulk import members (must be before /:id routes)
router.post("/members/bulk/import", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { members } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid members array" });
    }

    const results = await Member.insertMany(members, { ordered: false });
    res.status(201).json({ 
      success: true, 
      message: `${results.length} members imported successfully`,
      importedCount: results.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET all members with pagination & search
router.get("/members", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, department } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    if (status) filter.status = status;
    if (department) filter.department = department;

    const members = await Member.find(filter)
      .populate("departments")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Member.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: members,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create member
router.post("/members", auth, role("admin", "superAdmin"), async (req, res) => {
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
      return res.status(400).json({ success: false, message: "Required fields missing: name, surname, email, phone" });
    }

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    const member = new Member({ name, surname, email, phone, ...rest });
    const savedMember = await member.save();
    const populatedMember = await Member.findById(savedMember._id).populate("departments");

    res.status(201).json({ success: true, data: populatedMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET member by ID
router.get("/members/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate("departments");
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update member
router.put("/members/:id", auth, role("admin", "superAdmin"), async (req, res) => {
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
      "profileImageUrl",
      "status",
      "baptized",
      "emergencyContactName",
      "emergencyContactPhone",
      "notes",
      "departments"
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
      return res.status(404).json({ success: false, message: "Member not found" });
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
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.errors || error
    });
  }
});

// DELETE member
router.delete("/members/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }
    res.status(200).json({ success: true, message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// EVENTS ENDPOINTS (5)
// ============================================

// GET all events
router.get("/events", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
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
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET event by ID
router.get("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create event
router.post("/events", auth, role("admin", "superAdmin"), async (req, res) => {
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

// PUT update event
router.put("/events/:id", auth, role("admin", "superAdmin"), async (req, res) => {
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

// DELETE event
router.delete("/events/:id", auth, role("admin", "superAdmin"), async (req, res) => {
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

// ============================================
// ANNOUNCEMENTS ENDPOINTS (5)
// ============================================

// GET all announcements
router.get("/announcements", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, isPublished } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isPublished: isPublished !== "false" };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (type) filter.type = type;

    const announcements = await Announcement.find(filter)
      .populate("author", "name email")
      .limit(limit)
      .skip(skip)
      .sort({ publishDate: -1 });

    const total = await Announcement.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: announcements,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET announcement by ID
router.get("/announcements/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name email");

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create announcement
router.post("/announcements", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { title, content, ...rest } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const announcement = new Announcement({
      title,
      content,
      author: req.user._id,
      ...rest
    });

    const savedAnnouncement = await announcement.save();
    const populatedAnnouncement = await Announcement.findById(savedAnnouncement._id).populate("author", "name email");

    res.status(201).json({ success: true, data: populatedAnnouncement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update announcement
router.put("/announcements/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("author", "name email");
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE announcement
router.delete("/announcements/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DONATIONS ENDPOINTS (5)
// ============================================

// GET all donations
router.get("/donations", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, donationType } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) filter.donorName = { $regex: search, $options: "i" };
    if (status) filter.paymentStatus = status;
    if (donationType) filter.donationType = donationType;

    const donations = await Donation.find(filter)
      .populate("member", "firstName lastName")
      .limit(limit)
      .skip(skip)
      .sort({ donationDate: -1 });

    const total = await Donation.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: donations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET donation by ID
router.get("/donations/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("member", "firstName lastName email");
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create donation (from website form submission)
router.post("/donations", async (req, res) => {
  try {
    const { donorName, amount, donationType, ...rest } = req.body;

    if (!donorName || !amount) {
      return res.status(400).json({ success: false, message: "Donor name and amount are required" });
    }

    const donation = new Donation({
      donorName,
      amount,
      donationType,
      ...rest
    });

    const savedDonation = await donation.save();
    const populatedDonation = await Donation.findById(savedDonation._id).populate("member");

    res.status(201).json({ success: true, data: populatedDonation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update donation
router.put("/donations/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("member");
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }
    res.status(200).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE donation
router.delete("/donations/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }
    res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// SUBSCRIPTIONS ENDPOINTS (4)
// ============================================

// GET all subscriptions
router.get("/subscriptions", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, subscriptionType } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;
    if (subscriptionType) filter.subscriptionType = subscriptionType;

    const subscriptions = await Subscription.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Subscription.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: subscriptions,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST subscribe (from website)
router.post("/subscriptions", async (req, res) => {
  try {
    const { email, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription && existingSubscription.status === "Active") {
      return res.status(409).json({ success: false, message: "Already subscribed" });
    }

    const subscription = new Subscription({ email, status: "Active", ...rest });
    const savedSubscription = await subscription.save();

    res.status(201).json({ success: true, data: savedSubscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT manage subscription (update preferences)
router.put("/subscriptions/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE unsubscribe
router.delete("/subscriptions/:id", async (req, res) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "Unsubscribed", updatedAt: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, message: "Unsubscribed successfully", data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DEPARTMENTS ENDPOINTS (8: 5 + 3 for members)
// ============================================

// GET all departments
router.get("/departments", auth, async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };

    const departments = await Department.find(filter)
      .populate("head", "firstName lastName email")
      .populate("members", "firstName lastName email");

    res.status(200).json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET department by ID
router.get("/departments/:id", auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate("head", "firstName lastName email")
      .populate("members", "firstName lastName email phone");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create department
router.post("/departments", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { name, ...rest } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Department name is required" });
    }

    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(409).json({ success: false, message: "Department already exists" });
    }

    const department = new Department({ name, ...rest });
    const savedDept = await department.save();
    const populatedDept = await Department.findById(savedDept._id).populate("head members");

    res.status(201).json({ success: true, data: populatedDept });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update department
router.put("/departments/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("head members");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE department
router.delete("/departments/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET department members
router.get("/departments/:id/members", auth, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate("members");
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    res.status(200).json({ success: true, data: department.members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add member to department
router.post("/departments/:id/members", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ success: false, message: "Member ID is required" });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate("members");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, message: "Member added successfully", data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE remove member from department
router.delete("/departments/:id/members/:memberId", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.params.memberId } },
      { new: true }
    ).populate("members");

    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({ success: true, message: "Member removed successfully", data: department });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// PRAYER REQUESTS ENDPOINTS (5)
// ============================================

// GET all prayer requests
router.get("/prayer-requests", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, isPublic } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isPublic: isPublic !== "false" };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const prayerRequests = await PrayerRequest.find(filter)
      .populate("member", "firstName lastName")
      .populate("assignedTo", "name")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await PrayerRequest.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: prayerRequests,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET prayer request by ID
router.get("/prayer-requests/:id", async (req, res) => {
  try {
    const prayerRequest = await PrayerRequest.findById(req.params.id)
      .populate("member", "firstName lastName email phone")
      .populate("assignedTo", "name email")
      .populate("responses.userId", "name");

    if (!prayerRequest) {
      return res.status(404).json({ success: false, message: "Prayer request not found" });
    }
    res.status(200).json({ success: true, data: prayerRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create prayer request (from website)
router.post("/prayer-requests", async (req, res) => {
  try {
    const { requesterName, requesterEmail, title, content, ...rest } = req.body;

    if (!requesterName || !requesterEmail || !title || !content) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const prayerRequest = new PrayerRequest({
      requesterName,
      requesterEmail,
      title,
      content,
      ...rest
    });

    const savedRequest = await prayerRequest.save();
    const populatedRequest = await PrayerRequest.findById(savedRequest._id)
      .populate("member")
      .populate("assignedTo");

    res.status(201).json({ success: true, data: populatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update prayer request
router.put("/prayer-requests/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const prayerRequest = await PrayerRequest.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("member")
      .populate("assignedTo");

    if (!prayerRequest) {
      return res.status(404).json({ success: false, message: "Prayer request not found" });
    }
    res.status(200).json({ success: true, data: prayerRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE prayer request
router.delete("/prayer-requests/:id", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const prayerRequest = await PrayerRequest.findByIdAndDelete(req.params.id);
    if (!prayerRequest) {
      return res.status(404).json({ success: false, message: "Prayer request not found" });
    }
    res.status(200).json({ success: true, message: "Prayer request deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// NOTIFICATIONS ENDPOINTS (3)
// ============================================

// GET user notifications
router.get("/notifications", auth, async (req, res) => {
  try {
    const { unreadOnly = true } = req.query;

    let filter = { recipient: req.user._id };
    if (unreadOnly === "true") filter.isRead = false;

    const notifications = await Notification.find(filter)
      .sort({ sentAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user._id, 
      isRead: false 
    });

    res.status(200).json({ 
      success: true, 
      data: notifications,
      unreadCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT mark notification as read
router.put("/notifications/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE notification
router.delete("/notifications/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// DASHBOARD STATS ENDPOINTS (2)
// ============================================

// GET monthly stats (must be before /stats)
router.get("/dashboard/stats/monthly", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const donationStats = await Donation.aggregate([
      { $match: { donationDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$donationDate" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const memberStats = await Member.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          newMembers: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const eventStats = await Event.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          eventCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        donations: donationStats,
        members: memberStats,
        events: eventStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET overall stats
router.get("/dashboard/stats", auth, role("admin", "superAdmin"), async (req, res) => {
  try {
    const stats = {
      totalMembers: await Member.countDocuments(),
      activeMembers: await Member.countDocuments({ status: "Active" }),
      totalEvents: await Event.countDocuments(),
      totalAnnouncements: await Announcement.countDocuments({ isPublished: true }),
      totalDonations: await Donation.countDocuments(),
      totalDonationsAmount: (await Donation.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]))[0]?.total || 0,
      totalSubscriptions: await Subscription.countDocuments({ status: "Active" }),
      totalDepartments: await Department.countDocuments(),
      openPrayerRequests: await PrayerRequest.countDocuments({ status: "Open" }),
      totalPrayerRequests: await PrayerRequest.countDocuments()
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
