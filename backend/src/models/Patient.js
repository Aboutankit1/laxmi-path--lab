const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientId: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dob: { type: Date },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], default: "Unknown" },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    aadhaarNumber: { type: String, trim: true },
    emergencyContact: {
      name: String,
      relation: String,
      phone: String,
    },
    photo: { type: String, default: "" },
    qrCode: { type: String, default: "" },
    medicalHistory: { type: String, default: "" },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

patientSchema.index({ name: "text", mobile: "text", patientId: "text" });

module.exports = mongoose.model("Patient", patientSchema);
