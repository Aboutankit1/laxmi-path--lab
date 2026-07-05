const express = require("express");
const { getSamples, getSampleById, assignTechnician, updateSampleStatus } = require("../controllers/sampleController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/", getSamples);
router.get("/:id", getSampleById);
router.put("/:id/assign", authorize("superadmin", "admin", "receptionist"), assignTechnician);
router.put("/:id/status", authorize("superadmin", "admin", "technician"), updateSampleStatus);

module.exports = router;
