const express = require("express");
const { body } = require("express-validator");
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getPatients)
  .post(
    authorize("superadmin", "admin", "receptionist"),
    upload.single("photo"),
    [body("name").notEmpty(), body("mobile").notEmpty()],
    validateRequest,
    createPatient
  );

router
  .route("/:id")
  .get(getPatientById)
  .put(authorize("superadmin", "admin", "receptionist"), upload.single("photo"), updatePatient)
  .delete(authorize("superadmin", "admin"), deletePatient);

module.exports = router;
