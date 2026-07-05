const express = require("express");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getAppointments).post(authorize("superadmin", "admin", "receptionist"), createAppointment);
router.get("/:id", getAppointmentById);
router.put("/:id/status", authorize("superadmin", "admin", "receptionist", "technician"), updateAppointmentStatus);
router.put("/:id/reschedule", authorize("superadmin", "admin", "receptionist"), rescheduleAppointment);
router.put("/:id/cancel", authorize("superadmin", "admin", "receptionist"), cancelAppointment);

module.exports = router;
