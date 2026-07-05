const asyncHandler = require("express-async-handler");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Report = require("../models/Report");
const Invoice = require("../models/Invoice");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = startOfToday();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [
    totalPatients,
    todaysPatients,
    totalAppointments,
    pendingReports,
    completedReports,
    homeCollectionRequests,
    invoices,
    monthlyInvoices,
    totalDoctors,
    totalStaff,
  ] = await Promise.all([
    Patient.countDocuments({ isActive: true }),
    Patient.countDocuments({ isActive: true, createdAt: { $gte: today } }),
    Appointment.countDocuments(),
    Report.countDocuments({ status: { $in: ["Pending", "In Review"] } }),
    Report.countDocuments({ status: { $in: ["Completed", "Emailed"] } }),
    Appointment.countDocuments({ type: "Home Collection" }),
    Invoice.find(),
    Invoice.find({ createdAt: { $gte: startOfMonth } }),
    Doctor.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: true, role: { $ne: "superadmin" } }),
  ]);

  const totalRevenue = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const monthlyRevenue = monthlyInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const pendingPayments = invoices.reduce((sum, i) => sum + i.dueAmount, 0);

  res.json({
    success: true,
    data: {
      totalPatients,
      todaysPatients,
      totalTests: totalAppointments,
      pendingReports,
      completedReports,
      homeCollectionRequests,
      totalRevenue,
      monthlyRevenue,
      pendingPayments,
      totalDoctors,
      totalStaff,
    },
  });
});

// Revenue trend for last 6 months
const getRevenueChart = asyncHandler(async (req, res) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const invoices = await Invoice.find({ createdAt: { $gte: d, $lt: next } });
    const revenue = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    months.push({ month: d.toLocaleString("default", { month: "short" }), revenue });
  }
  res.json({ success: true, data: months });
});

// Most performed tests (top 5)
const getMostPerformedTests = asyncHandler(async (req, res) => {
  const agg = await Appointment.aggregate([
    { $unwind: "$tests" },
    { $group: { _id: "$tests", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: "tests", localField: "_id", foreignField: "_id", as: "test" } },
    { $unwind: "$test" },
    { $project: { name: "$test.name", count: 1 } },
  ]);
  res.json({ success: true, data: agg });
});

// Payment status breakdown
const getPaymentStatusChart = asyncHandler(async (req, res) => {
  const agg = await Invoice.aggregate([{ $group: { _id: "$paymentStatus", count: { $sum: 1 }, total: { $sum: "$grandTotal" } } }]);
  res.json({ success: true, data: agg });
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const [recentPatients, recentAppointments, recentReports] = await Promise.all([
    Patient.find().sort({ createdAt: -1 }).limit(5).select("name patientId createdAt"),
    Appointment.find().sort({ createdAt: -1 }).limit(5).populate("patient", "name").select("tokenNumber status createdAt"),
    Report.find().sort({ createdAt: -1 }).limit(5).populate("patient", "name").select("reportNumber status createdAt"),
  ]);
  res.json({ success: true, data: { recentPatients, recentAppointments, recentReports } });
});

module.exports = {
  getDashboardStats,
  getRevenueChart,
  getMostPerformedTests,
  getPaymentStatusChart,
  getRecentActivity,
};
