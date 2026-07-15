import { onlineDb } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logDisconnect } from "@/lib/disconnectLogger";
import { Client } from "pg";

export async function GET() {
  try {
    if (onlineDb) {
      await onlineDb.$queryRawUnsafe("SELECT 1 as connected");
      return NextResponse.json({ success: true, connected: true });
    }

    const client = new Client({ connectionString: process.env.ONLINE_DATABASE_URL });
    await client.connect();
    try {
      await client.query("SELECT 1 as connected");
      return NextResponse.json({ success: true, connected: true });
    } finally {
      await client.end();
    }
  } catch (error: any) {
    const errorMsg = error?.message || "Unknown error";
    console.error("PostgreSQL health check failed:", error);
    logDisconnect(`PostgreSQL disconnected: ${errorMsg}`);
    return NextResponse.json(
      { success: false, connected: false, error: "PostgreSQL connection failed" },
      { status: 500 }
    );
  }
}
