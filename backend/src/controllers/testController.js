const asyncHandler = require("express-async-handler");
const Test = require("../models/Test");

const createTest = asyncHandler(async (req, res) => {
  const test = await Test.create(req.body);
  res.status(201).json({ success: true, data: test });
});

const getTests = asyncHandler(async (req, res) => {
  const { search, category, status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [tests, total] = await Promise.all([
    Test.find(query).sort({ name: 1 }).skip(skip).limit(Number(limit)),
    Test.countDocuments(query),
  ]);

  res.json({ success: true, data: tests, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
});

const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }
  res.json({ success: true, data: test });
});

const updateTest = asyncHandler(async (req, res) => {
  const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }
  res.json({ success: true, data: test });
});

const deleteTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }
  test.status = "Inactive";
  await test.save();
  res.json({ success: true, message: "Test removed successfully" });
});

module.exports = { createTest, getTests, getTestById, updateTest, deleteTest };
