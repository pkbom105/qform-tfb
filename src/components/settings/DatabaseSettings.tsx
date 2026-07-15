"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Database, Server, RefreshCw, Loader2, FileText } from "lucide-react";

interface TableInfo {
  name: string;
  records: number;
}

interface DatabaseSettingsProps {
  connectionStatus: "idle" | "connected" | "failed";
  testing: boolean;
  testConnection: () => void;
  sqliteEnabled: string;
  toggle: (key: string) => void;
  pgConnectionStatus: "idle" | "connected" | "failed";
  testingPg: boolean;
  testPgConnection: () => void;
  syncing: boolean;
  onSync: () => void;
  disconnectLogs: { timestamp: string; message: string }[];
  logsLoading: boolean;
  fetchDisconnectLogs: () => void;
  pgTables: TableInfo[];
  pgTablesLoading: boolean;
  fetchPgTables: () => void;
}

export default function DatabaseSettings({
  connectionStatus,
  testing,
  testConnection,
  sqliteEnabled,
  toggle,
  pgConnectionStatus,
  testingPg,
  testPgConnection,
  syncing,
  onSync,
  disconnectLogs,
  logsLoading,
  fetchDisconnectLogs,
  pgTables,
  pgTablesLoading,
  fetchPgTables,
}: DatabaseSettingsProps) {
  return (
    <div className="space-y-6">
      {/* SQLite Database Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-slate-600" />
              <CardTitle>ฐานข้อมูล SQLite</CardTitle>
            </div>
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
                checked={sqliteEnabled === "true"}
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
        <CardContent className="space-y-4">
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
              onClick={onSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl font-light hover:bg-blue-800 transition-all disabled:opacity-50 text-sm"
            >
              <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
              {syncing ? "กำลังซิงค์..." : "ซิงค์ข้อมูลจาก VPN"}
            </button>
            <button
              onClick={fetchPgTables}
              disabled={pgTablesLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-xl font-light hover:bg-blue-800 transition-all disabled:opacity-50 text-sm"
            >
              <RefreshCw size={16} className={pgTablesLoading ? "animate-spin" : ""} />
              {pgTablesLoading ? "กำลังโหลด..." : "ดูตาราง"}
            </button>
          </div>

          {/* Tables & Records */}
          {pgTablesLoading ? (
            <div className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-blue-700">
              กำลังโหลดรายการตาราง...
            </div>
          ) : pgTables.length > 0 ? (
            <div className="rounded-xl border border-blue-200 bg-white p-4 space-y-2">
              {pgTables.map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800"
                >
                  <div className="font-light">DB Table Name: {t.name}</div>
                  <div className="font-medium">Number of Record: {t.records.toLocaleString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-blue-700">
              No PostgreSQL tables found in the public schema.
            </div>
          )}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const text = disconnectLogs.map(e => `[${e.timestamp}] ${e.message}`).join('\n');
                  navigator.clipboard.writeText(text);
                }}
                disabled={disconnectLogs.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-light bg-red-100 text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
              >
                คัดลอก error code
              </button>
              <button
                onClick={fetchDisconnectLogs}
                disabled={logsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-light bg-red-100 text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={logsLoading ? "animate-spin" : ""} />
                {logsLoading ? "กำลังโหลด..." : "รีเฟรช"}
              </button>
            </div>
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
    </div>
  );
}