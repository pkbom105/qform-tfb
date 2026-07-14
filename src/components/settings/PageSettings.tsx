"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Settings2 } from "lucide-react";

interface PageSettingsProps {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  language: string;
  updateSetting: (key: string, value: string) => void;
}

export default function PageSettings({ storeName, storeEmail, storePhone, language, updateSetting }: PageSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings2 size={20} className="text-slate-600" />
            <CardTitle>ข้อมูลทั่วไป</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-light text-black mb-1">ชื่อร้าน</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => updateSetting("store_name", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-black mb-1">อีเมล</label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => updateSetting("store_email", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-black mb-1">เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => updateSetting("store_phone", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-light text-black mb-1">ภาษา</label>
            <select
              value={language}
              onChange={(e) => updateSetting("language", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
            >
              <option>ไทย</option>
              <option>English</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}