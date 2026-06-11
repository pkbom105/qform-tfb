"use client";

import React, { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/toffy_logo.png" alt="Toffy Boutique" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-light text-black leading-tight">ทอฟฟี่ บูติก</h1>
              <p className="text-[10px] font-light text-slate-500 tracking-widest uppercase">TOFFY BOUTIQUE</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-light text-black hover:text-red-600 transition-colors">หน้าแรก</Link>
            <Link href="/#products" className="text-sm font-light text-black hover:text-red-600 transition-colors">สินค้า</Link>
            <Link href="/#process" className="text-sm font-light text-black hover:text-red-600 transition-colors">ขั้นตอนการผลิต</Link>
            <Link href="/#contact" className="text-sm font-light text-black hover:text-red-600 transition-colors">ติดต่อเรา</Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 border border-slate-300 text-black px-5 py-2.5 rounded-full text-sm font-light hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
            >
              แผงควบคุม
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-light hover:bg-slate-900 transition-all shadow-lg"
            >
              <ShoppingBag size={16} />
              สั่งผลิต
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className="block text-sm font-light text-black py-2" onClick={() => setIsOpen(false)}>หน้าแรก</Link>
            <Link href="/#products" className="block text-sm font-light text-black py-2" onClick={() => setIsOpen(false)}>สินค้า</Link>
            <Link href="/#process" className="block text-sm font-light text-black py-2" onClick={() => setIsOpen(false)}>ขั้นตอนการผลิต</Link>
            <Link href="/#contact" className="block text-sm font-light text-black py-2" onClick={() => setIsOpen(false)}>ติดต่อเรา</Link>
            <Link
              href="/dashboard"
              className="block text-center border border-slate-300 text-black px-6 py-2.5 rounded-full text-sm font-light hover:bg-slate-900 hover:text-white transition-all"
              onClick={() => setIsOpen(false)}
            >
              แผงควบคุม
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-light"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={16} />
              สั่งผลิต
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;