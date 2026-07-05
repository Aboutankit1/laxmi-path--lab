const asyncHandler = require("express-async-handler");
const Appointment = require("../models/Appointment");
const Sample = require("../models/Sample");
const Test = require("../models/Test");
const { v4: uuidv4 } = require("uuid");
const generateQRCode = require("../utils/qrGenerator");

const createAppointment = asyncHandler(async (req, res) => {
  const {
    patient,
    tests,
    referredDoctor,
    type,
    appointmentDate,
    homeAddress,
    notes,
  } = req.body;

  const tokenNumber = `TKN-${Date.now().toString().slice(-8)}`;

  const appointment = await Appointment.create({
    tokenNumber,
    patient,
    tests,
    referredDoctor: referredDoctor || null,
    type,
    appointmentDate,
    homeAddress,
    notes,
    createdBy: req.user._id,
  });

  // Auto-create pending samples for each test booked
  const testDocs = await Test.find({ _id: { $in: tests } });
  const sampleDocs = await Promise.all(
    testDocs.map(async (t) => {
      const sampleId = `SMP-${uuidv4().slice(0, 8).toUpperCase()}`;
      const qrCode = await generateQRCode({ sampleId, patient, test: t._id });
      return {
        sampleId,
        qrCode,
        appointment: appointment._id,
        patient,
        test: t._id,
        sampleType: t.sampleType,
        collectionType:
          type === "Home Collection" ? "Home Collection" : "Lab Visit",
      };
    }),
  );
  await Sample.insertMany(sampleDocs);

  const populated = await Appointment.findById(appointment._id)
    .populate("patient", "name patientId mobile")
    .populate("tests", "name price")
    .populate("referredDoctor", "name hospitalName");

  res.status(201).json({ success: true, data: populated });
});

const getAppointments = asyncHandler(async (req, res) => {
  const { status, type, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("patient", "name patientId mobile")
      .populate("tests", "name price")
      .populate("referredDoctor", "name hospitalName"),
    Appointment.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: appointments,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient")
    .populate("tests")
    .populate("referredDoctor");
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }
  res.json({ success: true, data: appointment });
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  );
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }
  res.json({ success: true, data: appointment });
});

const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { appointmentDate } = req.body;
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { appointmentDate, status: "Rescheduled" },
    { new: true },
  );
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }
  res.json({ success: true, data: appointment });
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "Cancelled" },
    { new: true },
  );
  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }
  res.json({ success: true, data: appointment });
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
};
