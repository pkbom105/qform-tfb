"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "admin" | "user" | null;

interface AuthUser {
  id: number;
  role: UserRole;
  name: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = window.localStorage.getItem("dashboard_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      window.localStorage.removeItem("dashboard_user");
      return null;
    }
  });

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (json.success) {
        const newUser: AuthUser = json.user;
        setUser(newUser);
        localStorage.setItem("dashboard_user", JSON.stringify(newUser));
        return { success: true };
      }
      return { success: false, error: json.error || "เข้าสู่ระบบไม่สำเร็จ" };
    } catch {
      return { success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
    }
  }, []);

  const logout = useCallback(() => {
    // Call the logout API to clear the session cookie
    fetch("/api/users/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    localStorage.removeItem("dashboard_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}