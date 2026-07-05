const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  protect,
  authorize("superadmin", "admin"),
  [body("name").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 })],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  loginUser
);

router.get("/me", protect, getMe);
router.post("/forgot-password", [body("email").isEmail()], validateRequest, forgotPassword);
router.post("/reset-password/:token", [body("password").isLength({ min: 6 })], validateRequest, resetPassword);
router.put("/change-password", protect, changePassword);

module.exports = router;
