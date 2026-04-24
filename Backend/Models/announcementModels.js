const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["News", "Alert", "Update", "Event"], default: "News" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  featuredImage: String,
  isPublished: { type: Boolean, default: true },
  publishDate: { type: Date, default: Date.now },
  expiryDate: Date,
  tags: [String],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Announcement", announcementSchema);
