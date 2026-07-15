"use client";

import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "ภาพรวม / วิเคราะห์", icon: LayoutDashboard },
  { href: "/dashboard/order-qform", label: "Order-QForm", icon: Users },
  { href: "/form", label: "ฟอร์มคำสั่งซื้อ", icon: ShoppingBag },
  { href: "/dashboard/settings", label: "ตั้งค่าระบบ", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();

  const sidebarContent = (
    <>
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
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
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
          onClick={() => setMobileOpen(false)}
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

      {/* Collapse Toggle (desktop only) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:block absolute -right-3 top-20 bg-slate-900 border border-slate-700 text-white rounded-full p-1 hover:bg-slate-800 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-full bg-slate-900 text-white flex-col transition-all duration-300 z-40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-full bg-slate-900 text-white flex flex-col transition-transform duration-300 z-50 w-64 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex justify-end p-4 border-b border-slate-800">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-base font-light ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-base font-light hover:bg-slate-800 rounded-xl px-4 py-3"
          >
            <ShoppingBag size={18} />
            <span>กลับสู่หน้าเว็บ</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;