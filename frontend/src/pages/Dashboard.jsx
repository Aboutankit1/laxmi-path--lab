import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import {
  FiUsers, FiUserPlus, FiFileText, FiCheckCircle, FiHome, FiDollarSign,
  FiClock, FiUserCheck, FiActivity, FiPlusCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../lib/api";
import StatCard from "../components/ui/StatCard";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

const COLORS = ["#245250", "#e2661f", "#5c8b87", "#f5ac74"];

const fetchStats = () => api.get("/dashboard/stats").then((r) => r.data.data);
const fetchRevenue = () => api.get("/dashboard/revenue-chart").then((r) => r.data.data);
const fetchTopTests = () => api.get("/dashboard/top-tests").then((r) => r.data.data);
const fetchPaymentStatus = () => api.get("/dashboard/payment-status").then((r) => r.data.data);
const fetchActivity = () => api.get("/dashboard/recent-activity").then((r) => r.data.data);

const quickActions = [
  { label: "Add Patient", to: "/patients", icon: FiUserPlus },
  { label: "Book Test", to: "/appointments", icon: FiActivity },
  { label: "Collect Sample", to: "/samples", icon: FiPlusCircle },
  { label: "Upload Report", to: "/reports", icon: FiFileText },
  { label: "Generate Invoice", to: "/invoices", icon: FiDollarSign },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({ queryKey: ["dashboard-stats"], queryFn: fetchStats });
  const { data: revenue = [] } = useQuery({ queryKey: ["dashboard-revenue"], queryFn: fetchRevenue });
  const { data: topTests = [] } = useQuery({ queryKey: ["dashboard-top-tests"], queryFn: fetchTopTests });
  const { data: paymentStatus = [] } = useQuery({ queryKey: ["dashboard-payment-status"], queryFn: fetchPaymentStatus });
  const { data: activity } = useQuery({ queryKey: ["dashboard-activity"], queryFn: fetchActivity });

  const cards = stats && [
    { label: "Total Patients", value: stats.totalPatients, icon: <FiUsers /> },
    { label: "Today's Patients", value: stats.todaysPatients, icon: <FiUserPlus />, accent: "clay" },
    { label: "Pending Reports", value: stats.pendingReports, icon: <FiClock /> },
    { label: "Completed Reports", value: stats.completedReports, icon: <FiCheckCircle /> },
    { label: "Home Collections", value: stats.homeCollectionRequests, icon: <FiHome /> },
    { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString("en-IN")}`, icon: <FiDollarSign />, accent: "clay" },
    { label: "Monthly Revenue", value: `₹${stats.monthlyRevenue?.toLocaleString("en-IN")}`, icon: <FiDollarSign /> },
    { label: "Pending Payments", value: `₹${stats.pendingPayments?.toLocaleString("en-IN")}`, icon: <FiClock /> },
    { label: "Total Doctors", value: stats.totalDoctors, icon: <FiUserCheck /> },
    { label: "Total Staff", value: stats.totalStaff, icon: <FiUsers /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Dashboard</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Overview of your lab's activity today</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {quickActions.map((qa) => (
          <Link
            key={qa.label}
            to={qa.to}
            className="focus-ring flex flex-col items-center gap-2 rounded-xl2 border border-ink-100 bg-white p-4 text-center shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-card dark:border-ink-800 dark:bg-ink-900"
          >
            <qa.icon size={20} className="text-clay-600 dark:text-clay-400" />
            <span className="text-xs font-medium text-ink-700 dark:text-ink-200">{qa.label}</span>
          </Link>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading || !cards
          ? Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl2" />)
          : cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Revenue (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e2661f" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#e2661f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#8fb0ad" fontSize={12} />
              <YAxis stroke="#8fb0ad" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#e2661f" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Payment Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={paymentStatus} dataKey="count" nameKey="_id" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {paymentStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Most Performed Tests</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topTests}>
              <XAxis dataKey="name" stroke="#8fb0ad" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="#8fb0ad" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#245250" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Recent Activity</h3>
          <ul className="space-y-3 text-sm">
            {activity?.recentPatients?.slice(0, 5).map((p) => (
              <li key={p._id} className="flex items-center justify-between">
                <span className="text-ink-700 dark:text-ink-200">New patient: {p.name}</span>
                <span className="text-xs text-ink-400">{new Date(p.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
