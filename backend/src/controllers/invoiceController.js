const asyncHandler = require("express-async-handler");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const generateSequentialId = require("../utils/generateId");
const { generateInvoicePDF } = require("../utils/pdfGenerator");
const Settings = require("../models/Settings");

const createInvoice = asyncHandler(async (req, res) => {
  const {
    patient,
    appointment,
    items,
    discount = 0,
    gstPercent = 0,
  } = req.body;

  const subTotal = items.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
    0,
  );
  const afterDiscount = subTotal - discount;
  const gstAmount = (afterDiscount * gstPercent) / 100;
  const grandTotal = afterDiscount + gstAmount;

  const invoiceNumber = await generateSequentialId(
    Invoice,
    "invoiceNumber",
    "INV",
  );

  const invoice = await Invoice.create({
    invoiceNumber,
    patient,
    appointment,
    items,
    subTotal,
    discount,
    gstPercent,
    gstAmount,
    grandTotal,
    dueAmount: grandTotal,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: invoice });
});

const getInvoices = asyncHandler(async (req, res) => {
  const { paymentStatus, page = 1, limit = 10 } = req.query;
  const query = {};
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const skip = (Number(page) - 1) * Number(limit);
  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("patient", "name patientId mobile"),
    Invoice.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: invoices,
    pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
  });
});

const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("patient")
    .populate("items.test", "name testCode");
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }
  res.json({ success: true, data: invoice });
});

// @desc Record a payment against an invoice
const recordPayment = asyncHandler(async (req, res) => {
  const { amount, mode, transactionId } = req.body;
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  const payment = await Payment.create({
    invoice: invoice._id,
    patient: invoice.patient,
    amount,
    mode,
    transactionId,
    receivedBy: req.user._id,
  });

  invoice.paidAmount += Number(amount);
  invoice.dueAmount = Math.max(invoice.grandTotal - invoice.paidAmount, 0);
  invoice.paymentStatus =
    invoice.dueAmount === 0
      ? "Paid"
      : invoice.paidAmount > 0
        ? "Partial"
        : "Pending";
  await invoice.save();

  res.status(201).json({ success: true, data: { invoice, payment } });
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ invoice: req.params.id }).populate(
    "receivedBy",
    "name",
  );
  res.json({ success: true, data: payments });
});

const downloadInvoice = asyncHandler(async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("patient")
      .populate("items.test", "name testCode price");

    if (!invoice) {
      res.status(404);
      throw new Error("Invoice not found");
    }

    const settings = await Settings.findOne();
    const labInfo = {
      labName: settings?.labName || "Laxmi Path Lab",
      address: settings?.address || "",
      phone: settings?.phone || "",
      disclaimer:
        settings?.disclaimer || "This is a computer generated document.",
    };

    const pdfBuffer = await generateInvoicePDF({
      labInfo,
      invoice,
      patient: invoice.patient,
    });

    if (!pdfBuffer || pdfBuffer.length === 0) {
      res.status(500);
      throw new Error("Failed to generate PDF");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Invoice_${invoice.invoiceNumber}.pdf"`,
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("[Invoice Download Error]", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  recordPayment,
  getPaymentHistory,
  downloadInvoice,
};
