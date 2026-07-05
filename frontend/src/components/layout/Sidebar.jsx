import React from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  FiGrid, FiUsers, FiUserPlus, FiActivity, FiCalendar, FiDroplet,
  FiFileText, FiCreditCard, FiPackage, FiUserCheck, FiBell, FiSettings,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const nav = [
  { to: "/", label: "Dashboard", icon: FiGrid, roles: ["superadmin", "admin", "receptionist", "technician"] },
  { to: "/patients", label: "Patients", icon: FiUsers, roles: ["superadmin", "admin", "receptionist"] },
  { to: "/doctors", label: "Doctors", icon: FiUserPlus, roles: ["superadmin", "admin"] },
  { to: "/tests", label: "Tests", icon: FiActivity, roles: ["superadmin", "admin"] },
  { to: "/appointments", label: "Appointments", icon: FiCalendar, roles: ["superadmin", "admin", "receptionist"] },
  { to: "/samples", label: "Samples", icon: FiDroplet, roles: ["superadmin", "admin", "technician"] },
  { to: "/reports", label: "Reports", icon: FiFileText, roles: ["superadmin", "admin", "technician"] },
  { to: "/invoices", label: "Billing", icon: FiCreditCard, roles: ["superadmin", "admin", "receptionist"] },
  { to: "/inventory", label: "Inventory", icon: FiPackage, roles: ["superadmin", "admin", "technician"] },
  { to: "/staff", label: "Staff", icon: FiUserCheck, roles: ["superadmin", "admin"] },
  { to: "/notifications", label: "Notifications", icon: FiBell, roles: ["superadmin", "admin", "receptionist", "technician"] },
  { to: "/settings", label: "Settings", icon: FiSettings, roles: ["superadmin", "admin"] },
];

export default function Sidebar({ open }) {
  const { hasRole } = useAuth();

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink-100 bg-white/95 backdrop-blur transition-transform dark:border-ink-800 dark:bg-ink-950/95 lg:static lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-6 dark:border-ink-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-800 font-display text-sm font-bold text-clay-300 dark:bg-clay-500 dark:text-ink-950">
          L
        </div>
        <span className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Laxmi Path Lab</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {nav
          .filter((item) => hasRole(...item.roles))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-ink-800 text-white dark:bg-clay-500 dark:text-ink-950"
                    : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}
