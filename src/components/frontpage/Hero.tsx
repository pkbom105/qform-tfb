"use client";

import React from "react";
import { ArrowRight, Shield, Clock, Award, HeartHandshake } from "lucide-react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-red-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-xs font-light text-red-700 uppercase tracking-wider">
                ผู้ผลิตยูนิฟอร์มครบวงจร
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-light text-black leading-tight">
              ผลิตเสื้อและยูนิฟอร์ม
              <br />
              <span className="text-red-600 font-normal">คุณภาพสูง</span>
              <br />
              สำหรับองค์กรของคุณ
            </h1>

            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-lg">
              ทอฟฟี่ บูติก ผู้ผลิตและจำหน่ายเสื้อโปโล เสื้อยืด ยูนิฟอร์มครบวงจร 
              ด้วยประสบการณ์มากกว่า 10 ปี งานคุณภาพ ราคาโรงงาน ส่งทั่วประเทศ
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-full font-light hover:bg-slate-900 transition-all shadow-xl shadow-red-200"
              >
                สั่งผลิตเลย
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 border-2 border-slate-200 text-black px-8 py-3.5 rounded-full font-light hover:border-red-600 hover:text-red-600 transition-all"
              >
                ติดต่อเรา
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
              {[
                { icon: Shield, label: "คุณภาพมาตรฐาน", sub: "QC ทุกขั้นตอน" },
                { icon: Clock, label: "ตรงต่อเวลา", sub: "ส่งมอบตามกำหนด" },
                { icon: Award, label: "รับประกัน", sub: "งานไม่ได้ดั่งใจ ยินดีแก้ไข" },
                { icon: HeartHandshake, label: "ให้คำปรึกษา", sub: "ฟรี ทุกดีไซน์" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon size={24} className="mx-auto text-red-600 mb-2" />
                  <p className="text-sm font-light text-black">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-light">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border border-slate-100">
                  <img
                    src="/toffy_logo.png"
                    alt="Toffy Boutique"
                    className="h-32 w-auto object-contain"
                  />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-2 border border-slate-100">
                <p className="text-xs font-light text-black">10+ ปี</p>
                <p className="text-[10px] text-slate-400">ประสบการณ์</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-50 rounded-2xl shadow-lg px-4 py-2 border border-green-100">
                <p className="text-xs font-light text-green-700">ลูกค้าพึงพอใจ</p>
                <p className="text-[10px] text-green-500">กว่า 500+ องค์กร</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;