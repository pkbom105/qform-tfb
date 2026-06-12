"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Save, User, Shield, Bell, Palette, Database, Server, RefreshCw, Loader2, FileText } from "lucide-react";

const defaultSettings: Record<string, string> = {
  "notification_new_order": "true",
  "notification_order_completed": "true",
  "dark_mode": "false",
  "language": "ไทย",
  "store_name": "ทอฟฟี่ บูติก",
  "store_email": "admin@toffyboutique.com",
  "store_phone": "088-888-8888",
  "sqlite_enabled": "true",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connected" | "failed">("idle");
  const [testingPg, setTestingPg] = useState(false);
  const [pgConnectionStatus, setPgConnectionStatus] = useState<"idle" | "connected" | "failed">("idle");
  const [syncing, setSyncing] = useState(false);
  const [disconnectLogs, setDisconnectLogs] = useState<{ timestamp: string; message: string }[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchDisconnectLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/settings/disconnect-logs");
      const json = await res.json();
      if (json.success) {
        setDisconnectLogs(json.logs);
      }
    } catch {
      // ignore
    } finally {
      setLogsLoading(false);
    }
  };

  const checkConnection = async () => {
    try {
      const res = await fetch("/api/settings/health");
      const json = await res.json();
      setConnectionStatus(json.connected ? "connected" : "failed");
    } catch {
      setConnectionStatus("failed");
    }
  };

  const checkPgConnection = async () => {
    try {
      const res = await fetch("/api/settings/health-pg");
      const json = await res.json();
      setPgConnectionStatus(json.connected ? "connected" : "failed");
    } catch {
      setPgConnectionStatus("failed");
    }
  };

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setSettings((prev) => ({ ...prev, ...json.data }));
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
        checkConnection();
        checkPgConnection();
      });
  }, []);

  const updateSetting = async (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await fetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: string) => {
    const current = settings[key] === "true" ? "false" : "true";
    updateSetting(key, current);
  };

  const testConnection = async () => {
    setTesting(true);
    setConnectionStatus("idle");
    try {
      const res = await fetch("/api/settings/health");
      const json = await res.json();
      setConnectionStatus(json.connected ? "connected" : "failed");
    } catch {
      setConnectionStatus("failed");
    } finally {
      setTesting(false);
    }
  };

  const testPgConnection = async () => {
    setTestingPg(true);
    setPgConnectionStatus("idle");
    try {
      const res = await fetch("/api/settings/health-pg");
      const json = await res.json();
      setPgConnectionStatus(json.connected ? "connected" : "failed");
    } catch {
      setPgConnectionStatus("failed");
    } finally {
      setTestingPg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-light text-black">ตั้งค่าระบบ</h1>
        <p className="text-base text-black font-light mt-1">
          จัดการการตั้งค่าต่างๆ ของระบบ (บันทึกใน SQLite)
        </p>
      </div>

      {/* SQLite Database Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-slate-600" />
              <CardTitle>ฐานข้อมูล SQLite</CardTitle>
            </div>
            {/* Persistent connection status badge */}
            {connectionStatus !== "idle" && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-light ${
                  connectionStatus === "connected"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected" ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                {connectionStatus === "connected" ? "เชื่อมต่ออยู่" : "ขาดการเชื่อมต่อ"}
              </span>
            )}
            {connectionStatus === "idle" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-light bg-slate-50 text-slate-500 border border-slate-200">
                <span className="w-2 h-2 bg-slate-400 rounded-full" />
                กำลังตรวจสอบ...
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-light text-black">เปิดใช้งาน SQLite</span>
              <p className="text-sm text-slate-500 font-light">ปิด/เปิด การใช้งานฐานข้อมูล SQLite</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings["sqlite_enabled"] === "true"}
                onChange={() => toggle("sqlite_enabled")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={testConnection}
              disabled={testing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-light hover:bg-slate-800 transition-all disabled:opacity-50 text-sm"
            >
              {testing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Database size={16} />
              )}
              {testing ? "กำลังทดสอบ..." : "ทดสอบการเชื่อมต่อ"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* PostgreSQL Database Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server size={20} className="text-blue-700" />
              <CardTitle className="text-blue-900">ฐานข้อมูล PostgreSQL (VPN)</CardTitle>
            </div>
            {pgConnectionStatus !== "idle" && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-light ${
                  pgConnectionStatus === "connected"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    pgConnectionStatus === "connected" ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                {pgConnectionStatus === "connected" ? "เชื่อมต่ออยู่" : "ขาดการเชื่อมต่อ"}
              </span>
            )}
            {pgConnectionStatus === "idle" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-light bg-slate-50 text-slate-500 border border-slate-200">
                <span className="w-2 h-2 bg-slate-400 rounded-full" />
                กำลังตรวจสอบ...
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <button
              onClick={testPgConnection}
              disabled={testingPg}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl font-light hover:bg-blue-800 transition-all disabled:opacity-50 text-sm"
            >
              {testingPg ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Server size={16} />
              )}
              {testingPg ? "กำลังทดสอบ..." : "ทดสอบการเชื่อมต่อ"}
            </button>
            <button
              onClick={async () => {
                setSyncing(true);
                try {
                  await fetch("/api/sync", { method: "POST" });
                } catch (err) {
                  console.error("Sync failed", err);
                } finally {
                  setSyncing(false);
                }
              }}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl font-light hover:bg-blue-800 transition-all disabled:opacity-50 text-sm"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
              {syncing ? "กำลังซิงค์..." : "ซิงค์ข้อมูลจาก VPN"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* PostgreSQL Disconnect Logs */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-red-700" />
              <CardTitle className="text-red-900">บันทึกการขาดการเชื่อมต่อ PostgreSQL</CardTitle>
            </div>
            <button
              onClick={fetchDisconnectLogs}
              disabled={logsLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-light bg-red-100 text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={logsLoading ? "animate-spin" : ""} />
              {logsLoading ? "กำลังโหลด..." : "รีเฟรช"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {disconnectLogs.length === 0 ? (
            <p className="text-sm text-red-500 font-light">
              {logsLoading ? "กำลังโหลด..." : "ไม่มีบันทึกการขาดการเชื่อมต่อ"}
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {disconnectLogs.map((entry, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-red-200 rounded-lg px-3 py-2 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-red-400 font-mono whitespace-nowrap mt-0.5">
                      {new Date(entry.timestamp).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                    <span className="text-red-800 font-light break-all">{entry.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User size={20} className="text-slate-600" />
              <CardTitle>ข้อมูลทั่วไป</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-light text-black mb-1">ชื่อร้าน</label>
              <input
                type="text"
                value={settings["store_name"] || ""}
                onChange={(e) => updateSetting("store_name", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">อีเมล</label>
              <input
                type="email"
                value={settings["store_email"] || ""}
                onChange={(e) => updateSetting("store_email", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={settings["store_phone"] || ""}
                onChange={(e) => updateSetting("store_phone", e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-slate-600" />
              <CardTitle>ความปลอดภัย</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-light text-black mb-1">รหัสผ่านปัจจุบัน</label>
              <input
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">รหัสผ่านใหม่</label>
              <input
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type="password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-slate-600" />
              <CardTitle>การแจ้งเตือน</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-light text-black">แจ้งเตือนเมื่อมีออเดอร์ใหม่</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings["notification_new_order"] === "true"}
                  onChange={() => toggle("notification_new_order")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-light text-black">แจ้งเตือนเมื่อคำสั่งซื้อเสร็จ</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings["notification_order_completed"] === "true"}
                  onChange={() => toggle("notification_order_completed")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Palette size={20} className="text-slate-600" />
              <CardTitle>รูปลักษณ์</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-light text-black">โหมดมืด</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings["dark_mode"] === "true"}
                  onChange={() => toggle("dark_mode")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-red-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">ภาษา</label>
              <select
                value={settings["language"] || "ไทย"}
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

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-light hover:bg-slate-900 transition-all shadow-lg disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
        </button>
      </div>
    </div>
  );
}
