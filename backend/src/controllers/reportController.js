const asyncHandler = require("express-async-handler");
const Report = require("../models/Report");
const Sample = require("../models/Sample");
const generateSequentialId = require("../utils/generateId");
const { generateReportPDF } = require("../utils/pdfGenerator");
const generateQRCode = require("../utils/qrGenerator");
const { sendEmail } = require("../config/mailer");
const Settings = require("../models/Settings");

const createReport = asyncHandler(async (req, res) => {
  const { appointment, patient, test, sample, results } = req.body;

  const reportNumber = await generateSequentialId(
    Report,
    "reportNumber",
    "RPT",
  );
  const qrVerificationCode = await generateQRCode({ reportNumber });

  const report = await Report.create({
    reportNumber,
    appointment,
    patient,
    test,
    sample,
    results,
    qrVerificationCode,
    verifiedBy: req.user._id,
    status: "In Review",
  });

  if (sample) await Sample.findByIdAndUpdate(sample, { status: "Completed" });

  res.status(201).json({ success: true, data: report });
});

const getReports = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [reports, total] = await Promise.all([
    Report.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("patient", "name patientId mobile email")
      .populate("test", "name testCode"),
    Report.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: reports,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("patient")
    .populate("test")
    .populate("verifiedBy", "name");
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  res.json({ success: true, data: report });
});

const generatePdfForReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("patient")
    .populate("test")
    .populate("verifiedBy", "name");
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }

  const settings = (await Settings.findOne()) || {};
  const pdfBuffer = await generateReportPDF({
    labInfo: settings,
    patient: report.patient,
    test: report.test,
    results: report.results,
    verifiedBy: report.verifiedBy?.name,
  });

  report.status = "Completed";
  report.completedAt = new Date();
  await report.save();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${report.reportNumber}.pdf`,
  });
  res.send(pdfBuffer);
});

const emailReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id)
    .populate("patient")
    .populate("test")
    .populate("verifiedBy", "name");
  if (!report) {
    res.status(404);
    throw new Error("Report not found");
  }
  if (!report.patient.email) {
    res.status(400);
    throw new Error("Patient does not have an email on file");
  }

  const settings = (await Settings.findOne()) || {};
  const pdfBuffer = await generateReportPDF({
    labInfo: settings,
    patient: report.patient,
    test: report.test,
    results: report.results,
    verifiedBy: report.verifiedBy?.name,
  });

  await sendEmail({
    to: report.patient.email,
    subject: `Your Lab Report - ${report.reportNumber}`,
    html: `<p>Dear ${report.patient.name},</p><p>Please find attached your report for ${report.test.name}.</p>`,
    attachments: [
      { filename: `${report.reportNumber}.pdf`, content: pdfBuffer },
    ],
  });

  report.status = "Emailed";
  await report.save();

  res.json({ success: true, message: "Report emailed successfully" });
});

module.exports = {
  createReport,
  getReports,
  getReportById,
  generatePdfForReport,
  emailReport,
};
