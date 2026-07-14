"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Save, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function UserSettings() {
  const { user, isAdmin } = useAuth();

  // --- Profile self-edit (for all users) ---
  const [profileUsername, setProfileUsername] = useState(user?.username || "");
  const [profilePassword, setProfilePassword] = useState("");
  const [profilePasswordConfirm, setProfilePasswordConfirm] = useState("");
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName || !profileUsername) {
      setProfileError("กรุณากรอกชื่อและชื่อผู้ใช้");
      return;
    }
    if (profilePassword && profilePassword !== profilePasswordConfirm) {
      setProfileError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);
    try {
      const body: Record<string, unknown> = { id: user!.id, name: profileName, username: profileUsername };
      if (profilePassword) body.password = profilePassword;
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setProfileSuccess(true);
        setProfilePassword("");
        setProfilePasswordConfirm("");
        const stored = localStorage.getItem("dashboard_user");
        if (stored) {
          const u = JSON.parse(stored);
          u.name = profileName;
          u.username = profileUsername;
          localStorage.setItem("dashboard_user", JSON.stringify(u));
        }
      } else {
        setProfileError(json.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setProfileError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setProfileSaving(false);
    }
  };

  // --- Admin: full user management ---
  const [users, setUsers] = useState<{ id: number; username: string; role: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "user">("user");
  const [editError, setEditError] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) setUsers(json.users);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchUsers();
    else setLoading(false);
  }, [isAdmin]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName) {
      setAddError("กรุณากรอกชื่อผู้ใช้และชื่อ");
      return;
    }
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole, name: newName }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddForm(false);
        setNewUsername("");
        setNewPassword("");
        setNewName("");
        setNewRole("user");
        fetchUsers();
      } else {
        setAddError(json.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setAddError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจต้องการลบผู้ใช้นี้?")) return;
    try {
      await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchUsers();
    } catch {
      console.error("Failed to delete user");
    }
  };

  const startEdit = (u: { id: number; username: string; role: string; name: string }) => {
    setEditUserId(u.id);
    setEditPassword("");
    setEditName(u.name);
    setEditRole(u.role as "admin" | "user");
    setEditError("");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName) {
      setEditError("กรุณากรอกชื่อ");
      return;
    }
    setEditing(true);
    setEditError("");
    try {
      const body: Record<string, unknown> = { id: editUserId, name: editName, role: editRole };
      if (editPassword) body.password = editPassword;
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (json.success) {
        setEditUserId(null);
        setEditPassword("");
        fetchUsers();
      } else {
        setEditError(json.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setEditError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-black" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Self-Edit (shown to all users) */}
      <Card>
        <CardHeader>
          <CardTitle>โปรไฟล์ของฉัน</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-light text-black mb-1">ชื่อผู้ใช้</label>
              <input
                type="text"
                value={profileUsername}
                onChange={(e) => setProfileUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">ชื่อ</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-light text-black mb-1">รหัสผ่านใหม่ (เว้นว่างไว้ไม่เปลี่ยน)</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder="ไม่ต้องเปลี่ยนให้เว้นว่าง"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-light text-black mb-1">ยืนยันรหัสผ่านใหม่</label>
              <input
                type={showPassword ? "text" : "password"}
                value={profilePasswordConfirm}
                onChange={(e) => setProfilePasswordConfirm(e.target.value)}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            {profileError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-700 font-light">{profileError}</p>
              </div>
            )}
            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <p className="text-sm text-green-700 font-light">บันทึกสำเร็จ</p>
              </div>
            )}
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-light hover:bg-slate-800 transition-all disabled:opacity-50 text-sm"
            >
              {profileSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {profileSaving ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Admin-only: full user management */}
      {isAdmin && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light text-black">จัดการผู้ใช้งานทั้งหมด</h2>
            <button
              onClick={() => { setShowAddForm(!showAddForm); setAddError(""); }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-light hover:bg-slate-800 transition-all text-sm"
            >
              {showAddForm ? "ยกเลิก" : "+ เพิ่มผู้ใช้"}
            </button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>เพิ่มผู้ใช้ใหม่</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-light text-black mb-1">ชื่อผู้ใช้ *</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-black mb-1">รหัสผ่าน</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="ว่างไว้ได้ (development)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-black mb-1">ชื่อ *</label>
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-light text-black mb-2">ระดับสิทธิ์</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="new-role"
                            value="user"
                            checked={newRole === "user"}
                            onChange={() => setNewRole("user")}
                            className="accent-slate-900"
                          />
                          <span className="text-sm text-slate-700">User</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="new-role"
                            value="admin"
                            checked={newRole === "admin"}
                            onChange={() => setNewRole("admin")}
                            className="accent-slate-900"
                          />
                          <span className="text-sm text-slate-700">Admin</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {addError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <p className="text-sm text-red-700 font-light">{addError}</p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={adding}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl font-light hover:bg-green-700 transition-all disabled:opacity-50 text-sm"
                    >
                      {adding ? <Loader2 size={16} className="animate-spin" /> : null}
                      {adding ? "กำลังเพิ่ม..." : "บันทึก"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>รายชื่อผู้ใช้ ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="p-4 text-sm font-light text-black uppercase">ชื่อผู้ใช้</th>
                      <th className="p-4 text-sm font-light text-black uppercase">ชื่อ</th>
                      <th className="p-4 text-sm font-light text-black uppercase">ระดับ</th>
                      <th className="p-4 text-sm font-light text-black uppercase text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-sm font-light text-black">{u.username}</td>
                        <td className="p-4 text-sm font-light text-black">{u.name}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-light ${
                            u.role === "admin"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-50 text-slate-600 border border-slate-200"
                          }`}>
                            {u.role === "admin" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEdit(u)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all font-light"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all font-light"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {editUserId !== null && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md border border-slate-200">
                <h3 className="text-xl font-light text-black mb-4">แก้ไขผู้ใช้</h3>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-light text-black mb-1">ชื่อ</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-black mb-1">รหัสผ่านใหม่ (เว้นว่างไว้ไม่เปลี่ยน)</label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="ไม่ต้องเปลี่ยนให้เว้นว่าง"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-base font-light text-black outline-none focus:border-slate-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-light text-black mb-2">ระดับสิทธิ์</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="edit-role"
                          value="user"
                          checked={editRole === "user"}
                          onChange={() => setEditRole("user")}
                          className="accent-slate-900"
                        />
                        <span className="text-sm text-slate-700">User</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="edit-role"
                          value="admin"
                          checked={editRole === "admin"}
                          onChange={() => setEditRole("admin")}
                          className="accent-slate-900"
                        />
                        <span className="text-sm text-slate-700">Admin</span>
                      </label>
                    </div>
                  </div>
                  {editError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <p className="text-sm text-red-700 font-light">{editError}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setEditUserId(null)}
                      className="px-4 py-2.5 border border-slate-200 rounded-xl font-light text-sm hover:bg-slate-50 transition-all"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={editing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-light hover:bg-slate-800 transition-all disabled:opacity-50 text-sm"
                    >
                      {editing ? <Loader2 size={16} className="animate-spin" /> : null}
                      {editing ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}