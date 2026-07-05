const express = require("express");
const { createItem, getItems, updateItem, deleteItem } = require("../controllers/inventoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);
router.use(authorize("superadmin", "admin", "technician"));

router.route("/").get(getItems).post(createItem);
router.route("/:id").put(updateItem).delete(deleteItem);

module.exports = router;
