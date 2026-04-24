const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["Info", "Warning", "Success", "Error"], default: "Info" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedDocument: String, // e.g., "Member", "Event", "Donation"
  relatedId: mongoose.Schema.Types.ObjectId,
  isRead: { type: Boolean, default: false },
  actionUrl: String,
  sentAt: { type: Date, default: Date.now },
  readAt: Date,
  expiryDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
