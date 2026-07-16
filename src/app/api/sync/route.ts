import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "ไม่จำเป็นต้องซิงค์ข้อมูล เนื่องจากใช้ PostgreSQL เป็นฐานข้อมูลเดียว",
    synced: 0,
  });
}