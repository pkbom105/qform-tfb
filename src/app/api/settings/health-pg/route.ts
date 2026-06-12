import { onlineDb } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Run a simple query to verify PostgreSQL connection
    await onlineDb.$queryRawUnsafe("SELECT 1 as connected");
    return NextResponse.json({ success: true, connected: true });
  } catch (error) {
    console.error("PostgreSQL health check failed:", error);
    return NextResponse.json(
      { success: false, connected: false, error: "PostgreSQL connection failed" },
      { status: 500 }
    );
  }
}