const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ["Patient", "User"], required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, refPath: "recipientType" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["Report Ready", "Appointment Reminder", "Payment Reminder", "General"],
      default: "General",
    },
    channel: { type: String, enum: ["Email", "SMS", "WhatsApp", "In-App"], default: "In-App" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
