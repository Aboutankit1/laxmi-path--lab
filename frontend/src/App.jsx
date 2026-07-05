import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import PatientsList from "./pages/patients/PatientsList";
import DoctorsList from "./pages/doctors/DoctorsList";
import TestsList from "./pages/tests/TestsList";
import AppointmentsList from "./pages/appointments/AppointmentsList";
import SamplesList from "./pages/samples/SamplesList";
import ReportsList from "./pages/reports/ReportsList";
import InvoicesList from "./pages/invoices/InvoicesList";
import InventoryList from "./pages/inventory/InventoryList";
import StaffList from "./pages/staff/StaffList";
import NotificationsList from "./pages/notifications/NotificationsList";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<PatientsList />} />
        <Route path="doctors" element={<DoctorsList />} />
        <Route path="tests" element={<TestsList />} />
        <Route path="appointments" element={<AppointmentsList />} />
        <Route path="samples" element={<SamplesList />} />
        <Route path="reports" element={<ReportsList />} />
        <Route path="invoices" element={<InvoicesList />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="staff" element={<StaffList />} />
        <Route path="notifications" element={<NotificationsList />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
