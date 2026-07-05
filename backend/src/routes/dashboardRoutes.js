const express = require("express");
const {
  getDashboardStats,
  getRevenueChart,
  getMostPerformedTests,
  getPaymentStatusChart,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/revenue-chart", getRevenueChart);
router.get("/top-tests", getMostPerformedTests);
router.get("/payment-status", getPaymentStatusChart);
router.get("/recent-activity", getRecentActivity);

module.exports = router;
