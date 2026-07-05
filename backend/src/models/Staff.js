const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    designation: { type: String, enum: ["Receptionist", "Lab Technician", "Admin"], required: true },
    salary: { type: Number, default: 0 },
    shift: { type: String, enum: ["Morning", "Evening", "Night", "Full Day"], default: "Full Day" },
    joiningDate: { type: Date, default: Date.now },
    attendance: [{ date: Date, status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave"] } }],
    leaves: [{ from: Date, to: Date, reason: String, status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
