import { Suspense } from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96">loading...</div>}>
      <DashboardTabs />
    </Suspense>
  );
}