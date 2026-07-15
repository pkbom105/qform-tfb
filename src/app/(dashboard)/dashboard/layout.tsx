"use client";

import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <div
          className={`transition-all duration-300 ml-0 md:ml-0 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}