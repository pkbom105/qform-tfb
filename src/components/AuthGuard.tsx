"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-black text-lg font-light">กำลังตรวจสอบสิทธิ์...</div>
      </div>
    );
  }

  // If requiredRole is "admin" but user is not admin, block access
  if (requiredRole === "admin" && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-200 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-light text-black mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-sm text-black font-light">
            คุณต้องเป็น Admin เพื่อดูหน้านี้
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}