"use client";

import React from "react";
import { Bell, Search, User } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200 w-80">
        <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหา..."
            className="bg-transparent outline-none text-base font-light text-black w-full placeholder:text-black"
          />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
            <User size={18} className="text-slate-500" />
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-light text-black">ผู้ดูแลระบบ</p>
            <p className="text-sm text-black font-light">admin@toffyboutique.com</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;