import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas-light dark:bg-canvas-dark">
      <Sidebar open={sidebarOpen} />
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Navbar onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
