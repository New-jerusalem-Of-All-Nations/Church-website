const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  head: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  email: String,
  phone: String,
  location: String,
  meetingSchedule: String,
  isActive: { type: Boolean, default: true },
  image: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Department", departmentSchema);
