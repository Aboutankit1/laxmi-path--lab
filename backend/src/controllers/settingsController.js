const asyncHandler = require("express-async-handler");
const Settings = require("../models/Settings");

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json({ success: true, data: settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    if (req.file) settings.logo = `/uploads/${req.file.filename}`;
    await settings.save();
  }
  res.json({ success: true, data: settings });
});

module.exports = { getSettings, updateSettings };
