"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutDashboard, BarChart3 } from "lucide-react";
import DashboardOverview from "./DashboardOverview";
import AnalyticsContent from "./AnalyticsContent";

const TABS = [
  { id: "overview", label: "ภาพรวม", icon: LayoutDashboard },
  { id: "analytics", label: "วิเคราะห์ข้อมูล", icon: BarChart3 },
];

const DashboardTabs: React.FC = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (tabParam === "analytics") {
      setActiveTab("analytics");
    }
  }, [tabParam]);

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="inline-flex items-center rounded-lg border border-slate-200 overflow-hidden bg-white">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              // Update URL without page reload
              const url = new URL(window.location.href);
              if (tab.id === "overview") {
                url.searchParams.delete("tab");
              } else {
                url.searchParams.set("tab", tab.id);
              }
              window.history.replaceState({}, "", url.toString());
            }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-light transition-all ${
              activeTab === tab.id
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            } ${index > 0 ? "border-l border-slate-200" : ""}`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <DashboardOverview />}
      {activeTab === "analytics" && <AnalyticsContent />}
    </div>
  );
};

export default DashboardTabs;
