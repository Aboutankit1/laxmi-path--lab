const asyncHandler = require("express-async-handler");
const Staff = require("../models/Staff");
const User = require("../models/User");

const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, designation, salary, shift } = req.body;

  const user = await User.create({ name, email, password, phone, role: role || "receptionist", createdBy: req.user._id });
  const staff = await Staff.create({ user: user._id, designation, salary, shift });

  res.status(201).json({ success: true, data: { user, staff } });
});

const getStaff = asyncHandler(async (req, res) => {
  const staff = await Staff.find().populate("user", "name email phone role isActive avatar");
  res.json({ success: true, data: staff });
});

const markAttendance = asyncHandler(async (req, res) => {
  const { date, status } = req.body;
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error("Staff record not found");
  }
  staff.attendance.push({ date, status });
  await staff.save();
  res.json({ success: true, data: staff });
});

const requestLeave = asyncHandler(async (req, res) => {
  const { from, to, reason } = req.body;
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    res.status(404);
    throw new Error("Staff record not found");
  }
  staff.leaves.push({ from, to, reason });
  await staff.save();
  res.json({ success: true, data: staff });
});

module.exports = { createStaff, getStaff, markAttendance, requestLeave };
