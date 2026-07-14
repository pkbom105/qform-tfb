"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Shield, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bypassRole, setBypassRole] = useState<"admin" | "user">("admin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("กรุณากรอกชื่อผู้ใช้");
      return;
    }
    setLoading(true);
    setError("");

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/toffy_logo.png" alt="Toffy Boutique" className="h-14 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-light text-black">Toffy Boutique Admin</h1>
            <p className="text-sm text-black font-light mt-1">เข้าสู่ระบบจัดการคำสั่งซื้อ</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-light text-black mb-1.5">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-light text-black mb-1.5">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ว่างไว้ได้ (development)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-700 font-light">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-light hover:bg-slate-800 transition-all border border-slate-900 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* Bypass - Temporary */}
          <div className="mt-6 pt-4 border-t border-dashed border-slate-200 space-y-3">
            <p className="text-xs text-slate-400 text-center mb-2">— Dev Bypass —</p>
            {/* Radio buttons */}
            <div className="flex justify-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bypass-role"
                  value="admin"
                  checked={bypassRole === "admin"}
                  onChange={() => setBypassRole("admin")}
                  className="accent-amber-600"
                />
                <span className="text-sm text-slate-700">Admin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="bypass-role"
                  value="user"
                  checked={bypassRole === "user"}
                  onChange={() => setBypassRole("user")}
                  className="accent-amber-600"
                />
                <span className="text-sm text-slate-700">User</span>
              </label>
            </div>
            {/* Single bypass button */}
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                const result = await login(bypassRole, "");
                setLoading(false);
                if (result.success) router.push("/dashboard");
                else setError(result.error || "เข้าสู่ระบบไม่สำเร็จ");
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-50 text-amber-700 px-6 py-2.5 rounded-2xl font-light hover:bg-amber-100 transition-all border border-amber-200 text-sm disabled:opacity-50"
            >
              ⏩ Bypass
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center mt-4">
            Development mode: ไม่ต้องใส่รหัสผ่าน
          </p>
        </div>
      </div>
    </div>
  );
}