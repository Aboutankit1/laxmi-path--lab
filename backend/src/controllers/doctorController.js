const asyncHandler = require("express-async-handler");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const createDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ success: true, data: doctor });
});

const getDoctors = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const query = { isActive: true };
  if (search) query.name = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [doctors, total] = await Promise.all([
    Doctor.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Doctor.countDocuments(query),
  ]);

  res.json({ success: true, data: doctors, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
});

const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.json({ success: true, data: doctor });
});

// referral history for a doctor - patients referred by them
const getDoctorReferrals = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ referredBy: req.params.id }).select("name patientId mobile createdAt");
  res.json({ success: true, data: patients });
});

const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.json({ success: true, data: doctor });
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  doctor.isActive = false;
  await doctor.save();
  res.json({ success: true, message: "Doctor removed successfully" });
});

module.exports = { createDoctor, getDoctors, getDoctorById, getDoctorReferrals, updateDoctor, deleteDoctor };
