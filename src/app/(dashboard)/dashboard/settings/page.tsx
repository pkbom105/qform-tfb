"use client";

import React, { useEffect, useState } from "react";
import { Save, User, Database, Globe, Loader2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import DatabaseSettings from "@/components/settings/DatabaseSettings";
import UserSettings from "@/components/settings/UserSettings";
import PageSettings from "@/components/settings/PageSettings";

const defaultSettings: Record<string, string> = {
  "notification_new_order": "true",
  "notification_order_completed": "true",
  "dark_mode": "false",
  "language": "ไทย",
  "store_name": "ทอฟฟี่ บูติก",
  "store_email": "admin@toffyboutique.com",
  "store_phone": "088-888-8888",
};

type TabKey = "database" | "user" | "page";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "database", label: "Database", icon: Database },
  { key: "user", label: "User Setting", icon: User },
  { key: "page", label: "Page Setting", icon: Globe },
];

export default function SettingsPage() {
  return <AuthGuard><SettingsContent /></AuthGuard>;
}

function SettingsContent() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("user");
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingPg, setTestingPg] = useState(false);
  const [pgConnectionStatus, setPgConnectionStatus] = useState<"idle" | "connected" | "failed">("idle");
  const [pgTables, setPgTables] = useState<{ name: string; records: number }[]>([]);
  const [pgTablesLoading, setPgTablesLoading] = useState(false);
  const [disconnectLogs, setDisconnectLogs] = useState<{ timestamp: string; message: string }[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchPgTables = async () => {
    setPgTablesLoading(true);
    try {
      const res = await fetch("/api/settings/pg-tables");
      const json = await res.json();
      if (json.success) {
        setPgTables(json.tables);
      }
    } catch {
      // ignore
    } finally {
      setPgTablesLoading(false);
    }
  };

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
        checkPgConnection();
        fetchDisconnectLogs();
      });
  }, []);

  useEffect(() => {
    if (activeTab === "database") {
      fetchPgTables();
    }
  }, [activeTab]);

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
      <div>
        <h1 className="text-3xl font-light text-black">ตั้งค่าระบบ</h1>
        <p className="text-base text-black font-light mt-1">
          จัดการการตั้งค่าต่างๆ ของระบบ
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-1">
        {tabs.filter((tab) => isAdmin || tab.key === "user").map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-light transition-all ${
                isActive
                  ? "bg-white text-black border border-b-white border-slate-200 -mb-px shadow-sm"
                  : "text-slate-500 hover:text-black hover:bg-slate-50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "database" && (
        <DatabaseSettings
          pgConnectionStatus={pgConnectionStatus}
          testingPg={testingPg}
          testPgConnection={testPgConnection}
          pgTables={pgTables}
          pgTablesLoading={pgTablesLoading}
          fetchPgTables={fetchPgTables}
          disconnectLogs={disconnectLogs}
          logsLoading={logsLoading}
          fetchDisconnectLogs={fetchDisconnectLogs}
          onClearLogs={() => setDisconnectLogs([])}
        />
      )}

      {activeTab === "user" && <UserSettings />}

      {activeTab === "page" && (
        <PageSettings
          storeName={settings["store_name"]}
          storeEmail={settings["store_email"]}
          storePhone={settings["store_phone"]}
          language={settings["language"]}
          updateSetting={updateSetting}
        />
      )}

      {(activeTab === "database" || activeTab === "page") && isAdmin && (
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
      )}
    </div>
  );
}