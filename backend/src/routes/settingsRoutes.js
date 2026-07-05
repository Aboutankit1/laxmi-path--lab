const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();
router.use(protect);

router.get("/", getSettings);
router.put("/", authorize("superadmin", "admin"), upload.single("logo"), updateSettings);

module.exports = router;
