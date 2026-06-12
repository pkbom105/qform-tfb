"use client";

import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/dashboard/analytics", label: "วิเคราะห์ข้อมูล", icon: BarChart3 },
  { href: "/dashboard/order-qform", label: "Order-QForm", icon: Users },
  { href: "/form", label: "ฟอร์มคำสั่งซื้อ", icon: ShoppingBag },
  { href: "/report-name", label: "จัดการรายงาน", icon: FileText },
  { href: "/dashboard/settings", label: "ตั้งค่าระบบ", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 text-white flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className={`flex items-center border-b border-slate-800 h-20 px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img src="/toffy_logo.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
            <div>
              <p className="text-sm font-light">ทอฟฟี่ บูติก</p>
              <p className="text-[8px] text-slate-400 tracking-wider uppercase">Admin Panel</p>
            </div>
          </div>
        )}
        {collapsed && (
          <img src="/toffy_logo.png" alt="Logo" className="h-8 w-auto brightness-0 invert" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-base font-light ${
                isActive
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className={`border-t border-slate-800 p-4 ${collapsed ? "text-center" : ""}`}>
        <Link
          href="/"
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-base font-light mb-3 hover:bg-slate-800 rounded-xl px-4 py-3"
        >
          <ShoppingBag size={18} />
          {!collapsed && <span>กลับสู่หน้าเว็บ</span>}
        </Link>
        {!collapsed && (
          <div className="text-center">
            <p className="text-sm text-slate-500">Toffy Boutique Admin</p>
            <p className="text-sm text-slate-600">v1.0.0</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-slate-900 border border-slate-700 text-white rounded-full p-1 hover:bg-slate-800 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Sidebar;