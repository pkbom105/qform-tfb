import { localDb } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Run a simple query to verify SQLite connection
    await localDb.$queryRawUnsafe("SELECT 1 as connected");
    return NextResponse.json({ success: true, connected: true });
  } catch (error) {
    console.error("SQLite health check failed:", error);
    return NextResponse.json(
      { success: false, connected: false, error: "SQLite connection failed" },
      { status: 500 }
    );
  }
}