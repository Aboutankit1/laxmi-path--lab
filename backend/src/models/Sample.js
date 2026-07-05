const mongoose = require("mongoose");

const sampleSchema = new mongoose.Schema(
  {
    sampleId: { type: String, unique: true },
    barcode: { type: String, default: "" },
    qrCode: { type: String, default: "" },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    sampleType: { type: String, enum: ["Blood", "Urine", "Stool", "Saliva", "Swab", "Other"] },
    collectionType: { type: String, enum: ["Lab Visit", "Home Collection"], default: "Lab Visit" },
    assignedTechnician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Pending", "Collected", "Processing", "Completed", "Rejected"],
      default: "Pending",
    },
    collectedAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sample", sampleSchema);
