const express = require("express");
const { createStaff, getStaff, markAttendance, requestLeave } = require("../controllers/staffController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(authorize("superadmin", "admin"), getStaff).post(authorize("superadmin", "admin"), createStaff);
router.put("/:id/attendance", authorize("superadmin", "admin"), markAttendance);
router.put("/:id/leave", requestLeave);

module.exports = router;
