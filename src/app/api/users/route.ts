import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

interface StoredUser {
  id: number;
  username: string;
  password: string;
  role: "admin" | "user";
  name: string;
}

function readUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(USERS_FILE)) {
      const defaults: StoredUser[] = [
        { id: 1, username: "admin", password: "", role: "admin", name: "Admin" },
        { id: 2, username: "user", password: "", role: "user", name: "User" },
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2));
      return defaults;
    }
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function GET() {
  const users = readUsers();
  // Don't expose passwords
  const safe = users.map(({ password, ...rest }) => rest);
  return NextResponse.json({ success: true, users: safe });
}

export async function POST(req: NextRequest) {
  try {
    const { username, password, role, name } = await req.json();
    if (!username || !name || !role) {
      return NextResponse.json({ success: false, error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    const users = readUsers();
    if (users.find((u) => u.username === username)) {
      return NextResponse.json({ success: false, error: "มีชื่อผู้ใช้นี้ในระบบแล้ว" }, { status: 400 });
    }

    const maxId = users.reduce((max, u) => Math.max(max, u.id), 0);
    const newUser: StoredUser = {
      id: maxId + 1,
      username,
      password: password || "",
      role: role as "admin" | "user",
      name,
    };
    users.push(newUser);
    writeUsers(users);

    return NextResponse.json({ success: true, user: { id: newUser.id, username: newUser.username, role: newUser.role, name: newUser.name } });
  } catch {
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, password, name, role, username } = await req.json();
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "ไม่พบผู้ใช้" }, { status: 404 });
    }
    if (password !== undefined) users[idx].password = password;
    if (name !== undefined) users[idx].name = name;
    if (role !== undefined) users[idx].role = role;
    if (username !== undefined) users[idx].username = username;
    writeUsers(users);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    let users = readUsers();
    users = users.filter((u) => u.id !== id);
    writeUsers(users);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}