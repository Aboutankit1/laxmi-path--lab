const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    tokenNumber: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true }],
    referredDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    type: { type: String, enum: ["Walk-in", "Online", "Home Collection"], default: "Walk-in" },
    appointmentDate: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ["Booked", "Confirmed", "Cancelled", "Rescheduled", "Completed"],
      default: "Booked",
    },
    homeAddress: { type: String, default: "" },
    notes: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
