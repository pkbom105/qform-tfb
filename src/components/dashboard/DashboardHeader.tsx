"use client";

import React from "react";
import { Bell, Search, Settings, User, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // Use window.location for hard redirect to ensure middleware checks cleared cookie
    window.location.href = "/login";
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      {/* Left: Hamburger (mobile) + Search (desktop) */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu button - mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          title="เปิดเมนู"
        >
          <Menu size={22} className="text-slate-600" />
        </button>

        {/* Search - desktop only */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 w-80">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="bg-transparent outline-none text-base font-light text-black w-full placeholder:text-black"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Settings - only show for admin */}
        {isAdmin && (
          <Link
            href="/dashboard/settings"
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Settings size={20} className="text-slate-600" />
          </Link>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <User size={18} className="text-slate-500" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-light text-black">{user?.name || "ผู้ใช้"}</p>
            <p className="text-sm text-black font-light">{isAdmin ? "Admin" : "User"}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-slate-400"
          title="ออกจากระบบ"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;