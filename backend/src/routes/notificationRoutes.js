const express = require("express");
const { createNotification, getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.route("/").get(getNotifications).post(authorize("superadmin", "admin"), createNotification);
router.put("/:id/read", markAsRead);

module.exports = router;
