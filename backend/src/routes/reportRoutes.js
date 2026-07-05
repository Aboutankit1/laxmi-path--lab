const express = require("express");
const {
  createReport,
  getReports,
  getReportById,
  generatePdfForReport,
  emailReport,
} = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getReports).post(authorize("superadmin", "admin", "technician"), createReport);
router.get("/:id", getReportById);
router.get("/:id/pdf", generatePdfForReport);
router.post("/:id/email", authorize("superadmin", "admin", "receptionist"), emailReport);

module.exports = router;
