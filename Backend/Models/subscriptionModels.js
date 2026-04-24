const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  subscriptionType: { type: String, enum: ["Newsletter", "Prayer Updates", "Event Updates", "All"], default: "All" },
  status: { type: String, enum: ["Active", "Unsubscribed", "Bounced"], default: "Active" },
  preferredFormat: { type: String, enum: ["HTML", "Text", "Both"], default: "Both" },
  frequency: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Weekly" },
  confirmedAt: Date,
  confirmationToken: String,
  unsubscribeToken: String,
  tags: [String],
  metadata: mongoose.Schema.Types.Mixed,
  lastEmailSent: Date,
  bounceCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
