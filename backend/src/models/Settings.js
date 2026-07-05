const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    labName: { type: String, default: "Laxmi Path Lab" },
    logo: { type: String, default: "" },
    address: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    website: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    reportHeader: { type: String, default: "" },
    reportFooter: { type: String, default: "" },
    digitalSignature: { type: String, default: "" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
