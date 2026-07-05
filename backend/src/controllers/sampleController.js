const asyncHandler = require("express-async-handler");
const Sample = require("../models/Sample");

const getSamples = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [samples, total] = await Promise.all([
    Sample.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("patient", "name patientId mobile")
      .populate("test", "name sampleType")
      .populate("assignedTechnician", "name"),
    Sample.countDocuments(query),
  ]);

  res.json({ success: true, data: samples, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
});

const getSampleById = asyncHandler(async (req, res) => {
  const sample = await Sample.findById(req.params.id).populate("patient").populate("test").populate("assignedTechnician", "name");
  if (!sample) {
    res.status(404);
    throw new Error("Sample not found");
  }
  res.json({ success: true, data: sample });
});

const assignTechnician = asyncHandler(async (req, res) => {
  const { technicianId } = req.body;
  const sample = await Sample.findByIdAndUpdate(req.params.id, { assignedTechnician: technicianId }, { new: true });
  if (!sample) {
    res.status(404);
    throw new Error("Sample not found");
  }
  res.json({ success: true, data: sample });
});

const updateSampleStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const update = { status };
  if (status === "Collected") update.collectedAt = new Date();

  const sample = await Sample.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!sample) {
    res.status(404);
    throw new Error("Sample not found");
  }
  res.json({ success: true, data: sample });
});

module.exports = { getSamples, getSampleById, assignTechnician, updateSampleStatus };
