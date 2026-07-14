import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

interface StoredUser {
  id: number;
  username: string;
  password: string;
  role: "admin" | "user";
  name: string;
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username) {
      return NextResponse.json({ success: false, error: "กรุณากรอกชื่อผู้ใช้" }, { status: 400 });
    }

    const users = readUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json({ success: false, error: "ไม่พบชื่อผู้ใช้" }, { status: 401 });
    }

    // In development, allow empty password
    if (user.password && password !== user.password) {
      return NextResponse.json({ success: false, error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // Create session token (base64 encoded user info for simplicity)
    const sessionData = JSON.stringify({ id: user.id, username: user.username, role: user.role });
    const sessionToken = Buffer.from(sessionData).toString("base64");

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
    });

    // Set session cookie for middleware auth check
    response.cookies.set("dashboard_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
