const asyncHandler = require("express-async-handler");
const Inventory = require("../models/Inventory");

const createItem = asyncHandler(async (req, res) => {
  const item = await Inventory.create(req.body);
  res.status(201).json({ success: true, data: item });
});

const getItems = asyncHandler(async (req, res) => {
  const { lowStock, category, page = 1, limit = 10 } = req.query;
  const query = {};
  if (category) query.category = category;

  let items = await Inventory.find(query).sort({ createdAt: -1 });
  if (lowStock === "true") {
    items = items.filter((i) => i.quantity <= i.lowStockThreshold);
  }

  res.json({ success: true, data: items });
});

const updateItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) {
    res.status(404);
    throw new Error("Inventory item not found");
  }
  res.json({ success: true, data: item });
});

const deleteItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Inventory item not found");
  }
  res.json({ success: true, message: "Item deleted successfully" });
});

module.exports = { createItem, getItems, updateItem, deleteItem };
