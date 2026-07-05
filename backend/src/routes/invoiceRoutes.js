const express = require("express");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  recordPayment,
  getPaymentHistory,
  downloadInvoice,
} = require("../controllers/invoiceController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(protect);

router
  .route("/")
  .get(getInvoices)
  .post(authorize("superadmin", "admin", "receptionist"), createInvoice);
router.get("/:id/download", downloadInvoice);
router.get("/:id", getInvoiceById);
router.post(
  "/:id/payments",
  authorize("superadmin", "admin", "receptionist"),
  recordPayment,
);
router.get("/:id/payments", getPaymentHistory);

module.exports = router;
