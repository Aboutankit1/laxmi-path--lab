import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiSun, FiMoon, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const roleLabels = {
  superadmin: "Super Admin",
  admin: "Admin",
  receptionist: "Receptionist",
  technician: "Lab Technician",
};

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80 sm:px-6">
      <button onClick={onMenuClick} className="focus-ring rounded-lg p-2 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 lg:hidden">
        <FiMenu size={20} />
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="focus-ring rounded-lg p-2.5 text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800" aria-label="Toggle theme">
          {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>
        <div className="relative" ref={ref}>
          <button onClick={() => setMenuOpen((o) => !o)} className="focus-ring flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-100 dark:hover:bg-ink-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-white dark:bg-clay-500 dark:text-ink-950">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{user?.name}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">{roleLabels[user?.role] || user?.role}</p>
            </div>
            <FiChevronDown size={16} className="text-ink-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-ink-100 bg-white py-1.5 shadow-card dark:border-ink-800 dark:bg-ink-900">
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800">
                <FiUser size={15} /> My Profile
              </button>
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <FiLogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
