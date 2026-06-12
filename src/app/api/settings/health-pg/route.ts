import { onlineDb } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logDisconnect } from "@/lib/disconnectLogger";

export async function GET() {
  try {
    // Run a simple query to verify PostgreSQL connection
    await onlineDb.$queryRawUnsafe("SELECT 1 as connected");
    return NextResponse.json({ success: true, connected: true });
  } catch (error: any) {
    const errorMsg = error?.message || "Unknown error";
    console.error("PostgreSQL health check failed:", error);
    // Log the disconnect event
    logDisconnect(`PostgreSQL disconnected: ${errorMsg}`);
    return NextResponse.json(
      { success: false, connected: false, error: "PostgreSQL connection failed" },
      { status: 500 }
    );
  }
}
