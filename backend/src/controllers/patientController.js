const asyncHandler = require("express-async-handler");
const Patient = require("../models/Patient");
const generateSequentialId = require("../utils/generateId");
const generateQRCode = require("../utils/qrGenerator");

// @desc  Create patient
// @route POST /api/patients
const createPatient = asyncHandler(async (req, res) => {
  const patientId = await generateSequentialId(Patient, "patientId", "PT");

  const patient = await Patient.create({
    ...req.body,
    patientId,
    photo: req.file ? `/uploads/${req.file.filename}` : "",
    createdBy: req.user._id,
  });

  patient.qrCode = await generateQRCode({ patientId: patient.patientId, name: patient.name });
  await patient.save();

  res.status(201).json({ success: true, data: patient });
});

// @desc  Get all patients (search, filter, paginate)
// @route GET /api/patients
const getPatients = asyncHandler(async (req, res) => {
  const { search, gender, page = 1, limit = 10 } = req.query;
  const query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { patientId: { $regex: search, $options: "i" } },
    ];
  }
  if (gender) query.gender = gender;

  const skip = (Number(page) - 1) * Number(limit);

  const [patients, total] = await Promise.all([
    Patient.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate("referredBy", "name hospitalName"),
    Patient.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: patients,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single patient
// @route GET /api/patients/:id
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id).populate("referredBy", "name hospitalName");
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }
  res.json({ success: true, data: patient });
});

// @desc  Update patient
// @route PUT /api/patients/:id
const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  Object.assign(patient, req.body);
  if (req.file) patient.photo = `/uploads/${req.file.filename}`;

  await patient.save();
  res.json({ success: true, data: patient });
});

// @desc  Delete (deactivate) patient
// @route DELETE /api/patients/:id
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  patient.isActive = false;
  await patient.save();

  res.json({ success: true, message: "Patient removed successfully" });
});

module.exports = { createPatient, getPatients, getPatientById, updatePatient, deletePatient };
