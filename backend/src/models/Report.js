const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportNumber: { type: String, unique: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    sample: { type: mongoose.Schema.Types.ObjectId, ref: "Sample" },
    results: [{ parameter: String, value: String, unit: String, normalRange: String, flag: { type: String, enum: ["Normal", "High", "Low", "Critical"], default: "Normal" } }],
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pdfUrl: { type: String, default: "" },
    qrVerificationCode: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "In Review", "Completed", "Emailed"], default: "Pending" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
