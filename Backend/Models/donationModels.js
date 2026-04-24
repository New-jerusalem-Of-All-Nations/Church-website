const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: String,
  donorPhone: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  donationType: { type: String, enum: ["General", "Tithe", "Offering", "Building Fund", "Missions"], default: "General" },
  method: { type: String, enum: ["Card", "Bank Transfer", "Cash", "Online"], default: "Online" },
  transactionId: String,
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Pending" },
  member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  isAnonymous: { type: Boolean, default: false },
  notes: String,
  receiptSent: { type: Boolean, default: false },
  donationDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Donation", donationSchema);
