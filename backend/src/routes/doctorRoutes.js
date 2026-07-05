const express = require("express");
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  getDoctorReferrals,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getDoctors).post(authorize("superadmin", "admin"), createDoctor);
router.get("/:id/referrals", getDoctorReferrals);
router
  .route("/:id")
  .get(getDoctorById)
  .put(authorize("superadmin", "admin"), updateDoctor)
  .delete(authorize("superadmin", "admin"), deleteDoctor);

module.exports = router;
