const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Reagent", "Chemical", "Test Kit", "Consumable", "Equipment"], required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: "pcs" },
    vendor: { type: String, default: "" },
    purchaseDate: { type: Date },
    expiryDate: { type: Date },
    lowStockThreshold: { type: Number, default: 10 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
