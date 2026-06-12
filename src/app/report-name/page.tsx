"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Copy, Check } from "lucide-react";
import { fetchNextReportName } from "@/lib/reportNameGenerator";

export default function ReportNamePage() {
  const [currentName, setCurrentName] = useState<string>("");
  const [counter, setCounter] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    updateReportName();
  }, []);

  const updateReportName = () => {
    // Fetch next report name from server (DB-based)
    fetchNextReportName().then((name) => {
      setCurrentName(name);
    });

    // Get current max order count from server
    fetch("/api/report-name/next")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCounter(json.nextOrderId);
        }
      })
      .catch(() => {});
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(currentName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-slate-200">
          <h1 className="text-3xl font-light text-black mb-2">Report Name Manager</h1>
          <p className="text-black">ระบบจัดการชื่อรายงาน TFB Order Form</p>
        </div>

        {/* Current Name Display */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-red-200">
          <div className="mb-4">
            <label className="text-sm font-light text-black uppercase tracking-wider block mb-3">
              Current Report Name
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-50 border-2 border-red-600 rounded-2xl px-6 py-4">
                <p className="text-xl font-light text-black break-all">{currentName}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          {/* Format Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <p className="text-sm font-light text-black mb-2">
              <strong>Format:</strong> TFB-OrderForm-YYMM-XXXX
            </p>
            <ul className="text-xs font-light text-black space-y-1 ml-4">
              <li>• <strong>YY</strong> = ปีสั้น (25 = 2025, 26 = 2026)</li>
              <li>• <strong>MM</strong> = เดือน (01-12)</li>
              <li>• <strong>XXXX</strong> = เลขที่เพิ่มขึ้นอัตโนมัติ (0001, 0002, ...)</li>
            </ul>
          </div>
        </div>

        {/* Counter Status */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-light text-black uppercase tracking-wider block mb-2">
                Current Month
              </label>
              <div className="text-2xl font-light text-black">
                {new Date().toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-light text-black uppercase tracking-wider block mb-2">
                Counter for This Month
              </label>
              <div className="text-4xl font-light text-red-600">{counter}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={updateReportName}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-2xl font-light transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw size={18} />
            Refresh Current Name
          </button>
          <button
            onClick={updateReportName}
            className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-2xl font-light transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <RotateCcw size={18} />
            Refresh from Database
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 mt-6">
          <h2 className="text-lg font-light text-black mb-4">วิธีการใช้งาน</h2>
          <div className="space-y-3 text-sm font-light text-black">
            <p>1. ชื่อรายงานจะเพิ่มเลขขึ้นอัตโนมัติสำหรับแต่ละการส่งฟอร์ม</p>
            <p>2. เลขที่จะรีเซ็ตอัตโนมัติทุกต้นเดือน</p>
            <p>3. สามารถคัดลอกชื่อรายงานได้ด้วยปุ่ม Copy</p>
            <p>4. หากต้องการรีเซ็ตเลขที่ให้คลิกปุ่ม "Reset Counter"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
