const mongoose = require("mongoose");

const prayerRequestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  requesterPhone: String,
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ["Health", "Family", "Job", "Spiritual", "Other"], default: "Other" },
  priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  isAnonymous: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  status: { type: String, enum: ["Open", "In Progress", "Answered", "Closed"], default: "Open" },
  member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  responses: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: String,
    date: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PrayerRequest", prayerRequestSchema);
