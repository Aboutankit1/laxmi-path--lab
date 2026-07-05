const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    testCode: { type: String, required: true, unique: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    sampleType: {
      type: String,
      enum: ["Blood", "Urine", "Stool", "Saliva", "Swab", "Other"],
      default: "Blood",
    },
    reportTimeHours: { type: Number, default: 24 },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    parameters: [{ name: String, unit: String, normalRange: String }],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Test", testSchema);
