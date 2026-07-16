"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Server, RefreshCw, Loader2, FileText } from "lucide-react";

interface TableInfo {
  name: string;
  records: number;
}

interface DatabaseSettingsProps {
  pgConnectionStatus: "idle" | "connected" | "failed";
  testingPg: boolean;
  testPgConnection: () => void;
  pgTables: TableInfo[];
  pgTablesLoading: boolean;
  fetchPgTables: () => void;
  disconnectLogs?: { timestamp: string; message: string }[];
  logsLoading?: boolean;
  fetchDisconnectLogs?: () => void;
  onClearLogs?: () => void;
}

export default function DatabaseSettings({
  pgConnectionStatus,
  testingPg,
  testPgConnection,
  pgTables,
  pgTablesLoading,
  fetchPgTables,
  disconnectLogs = [],
  logsLoading = false,
  fetchDisconnectLogs,
  onClearLogs,
}: DatabaseSettingsProps) {
  const handleRefresh = () => {
    if (onClearLogs) onClearLogs();
    if (fetchDisconnectLogs) fetchDisconnectLogs();
  };

  return (
    <div className="space-y-6">
      {/* PostgreSQL Database Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server size={20} className="text-blue-700" />
              <CardTitle className="text-blue-900">ฐานข้อมูล PostgreSQL — qform2026</CardTitle>
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
                {pgConnectionStatus === "connected" ? "ใช้งานอยู่" : "ขาดการเชื่อมต่อ"}
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
          <div className="rounded-lg bg-blue-100 px-4 py-3 text-sm text-blue-800">
            <div className="font-medium">Database Name: <span className="font-bold">qform2026</span></div>
            <div className="font-light mt-1">Host: localhost:5432 | Status: {pgConnectionStatus === "connected" ? "🟢 Connected" : "🔴 Disconnected"}</div>
          </div>

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
      <Card className={`border ${pgConnectionStatus === "connected" && disconnectLogs.length === 0 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={20} className={pgConnectionStatus === "connected" && disconnectLogs.length === 0 ? "text-green-700" : "text-red-700"} />
              <CardTitle className={pgConnectionStatus === "connected" && disconnectLogs.length === 0 ? "text-green-900" : "text-red-900"}>
                บันทึกการขาดการเชื่อมต่อ PostgreSQL
              </CardTitle>
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
                คัดลอก log
              </button>
              {fetchDisconnectLogs && (
                <button
                  onClick={handleRefresh}
                  disabled={logsLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-light bg-red-100 text-red-700 hover:bg-red-200 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={14} className={logsLoading ? "animate-spin" : ""} />
                  {logsLoading ? "กำลังโหลด..." : "รีเฟรช"}
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <p className="text-sm text-slate-500 font-light">กำลังโหลด...</p>
          ) : disconnectLogs.length === 0 && pgConnectionStatus === "connected" ? (
            <p className="text-sm text-green-600 font-light">✅ PostgreSQL ทำงานปกติ — ไม่มีประวัติขาดการเชื่อมต่อ</p>
          ) : disconnectLogs.length === 0 ? (
            <p className="text-sm text-slate-500 font-light">ไม่มีบันทึก</p>
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